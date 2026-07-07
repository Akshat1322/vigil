from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from dataclasses import dataclass
import os
import json

@dataclass
class PromptMutation:
    prompt_id: str
    category: str
    original_prompt: str
    original_score: float
    drift_direction: str
    suggested_rewrite: str
    reasoning: str

MUTATION_SYSTEM_PROMPT = """You are an expert prompt engineer 
specializing in making AI prompts robust against model 
behavioral changes.

You will be given a prompt that showed drift — the AI model 
started responding to it differently than before. Your job is 
to suggest a more explicit, unambiguous rewrite that produces 
consistent results regardless of minor model behavior changes.

Rules for rewrites:
- Make instructions more explicit and unambiguous
- Add output format constraints where missing
- Remove any wording that could be interpreted multiple ways
- Keep the core intent identical — do not change what is being tested
- Do not make the prompt longer than necessary

Return ONLY valid JSON in this exact format, nothing else:
{{
  "rewrite": "the improved prompt text here",
  "reasoning": "one sentence explaining what made the original ambiguous"
}}"""

MUTATION_HUMAN_PROMPT = """Original prompt (category: {category}):
{original_prompt}

Drift detected: {drift_description}

Suggest a more robust rewrite."""

def build_mutation_chain():
    """
    Build the LangChain mutation chain.
    Groq API key read from GROQ_API_KEY env var.
    Returns None if GROQ_API_KEY not set.
    """
    api_key = os.getenv('GROQ_API_KEY')
    if not api_key:
        print("GROQ_API_KEY not set — skipping mutation suggestions")
        return None

    llm = ChatGroq(
        model="llama-3.1-8b-instant",
        temperature=0.3,  # slight creativity for rewrites
        max_tokens=500,
        api_key=api_key
    )

    prompt_template = ChatPromptTemplate.from_messages([
        ("system", MUTATION_SYSTEM_PROMPT),
        ("human", MUTATION_HUMAN_PROMPT)
    ])

    # LangChain LCEL chain: prompt | llm | parser
    chain = prompt_template | llm | StrOutputParser()
    return chain

def describe_drift(drift_result) -> str:
    """Convert a DriftResult into a plain English description."""
    direction_map = {
        "increased": "scores increased (model now over-performs this prompt)",
        "decreased": "scores decreased (model now fails this prompt more often)",
        "unchanged": "no change detected",
        "semantic_shift": "meaning of responses shifted significantly"
    }
    magnitude_map = {
        "small": "minor",
        "medium": "moderate", 
        "large": "significant",
        "none": "no"
    }
    direction = direction_map.get(drift_result.direction, drift_result.direction)
    magnitude = magnitude_map.get(drift_result.magnitude, drift_result.magnitude)
    return f"{magnitude} drift — {direction} (Z-score: {drift_result.z_score:.2f})"

def suggest_mutations(
    drift_results: list,
    prompts: list,
    max_suggestions: int = 5
) -> list[PromptMutation]:
    """
    Run the mutation chain on drifted prompts.
    
    Args:
        drift_results: list of DriftResult objects from detector
        prompts: list of prompt dicts from prompts_v2.json
        max_suggestions: max prompts to suggest rewrites for
                        (avoid excessive API calls)
    
    Returns:
        list of PromptMutation objects
    """
    chain = build_mutation_chain()
    if chain is None:
        return []

    # Only process drifted prompts
    drifted = [r for r in drift_results if r.drift_detected]
    
    if not drifted:
        return []

    # Sort by Cohen's d descending — worst drift first
    drifted.sort(key=lambda r: r.cohens_d, reverse=True)
    
    # Cap at max_suggestions to avoid excessive API calls
    to_process = drifted[:max_suggestions]
    
    # Build prompt lookup dict
    prompt_lookup = {p['id']: p for p in prompts}
    
    mutations = []
    for drift_result in to_process:
        prompt_config = prompt_lookup.get(drift_result.prompt_id)
        if not prompt_config:
            continue
        
        drift_description = describe_drift(drift_result)
        
        try:
            raw_output = chain.invoke({
                "category": drift_result.category,
                "original_prompt": prompt_config['prompt'],
                "drift_description": drift_description
            })
            
            # Parse JSON response
            # Strip markdown code fences if present
            clean = raw_output.strip()
            if clean.startswith("```"):
                clean = clean.split("```")[1]
                if clean.startswith("json"):
                    clean = clean[4:]
            clean = clean.strip()
            
            parsed = json.loads(clean)
            
            mutations.append(PromptMutation(
                prompt_id=drift_result.prompt_id,
                category=drift_result.category,
                original_prompt=prompt_config['prompt'],
                original_score=drift_result.current_mean,
                drift_direction=drift_result.direction,
                suggested_rewrite=parsed.get('rewrite', ''),
                reasoning=parsed.get('reasoning', '')
            ))
            
        except Exception as e:
            print(f"Mutation failed for {drift_result.prompt_id}: {e}")
            continue
    
    return mutations
