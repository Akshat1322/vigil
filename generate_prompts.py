import json
import os

with open('harness/prompts/prompts_v1.json') as f:
    v1_data = json.load(f)

new_prompts = []

# HALLUCINATION
hallu_data = [
    # Geography
    ("What is the capital of Italy? Answer with only the city name.", "rome"),
    ("What is the longest river in the world? Answer with only the river name.", "nile"),
    ("What is the highest mountain in the world? Answer with only the mountain name.", "everest"),
    ("What country has the largest population? Answer with only the country name.", "india"),
    ("What is the capital of Japan? Answer with only the city name.", "tokyo"),
    # Science
    ("What is the chemical symbol for Oxygen? Answer with only the symbol.", "o"),
    ("Which planet is known as the Red Planet? Answer with only the planet name.", "mars"),
    ("What is the SI unit of force? Answer with only the unit name.", "newton"),
    ("What is the chemical symbol for Iron? Answer with only the symbol.", "fe"),
    ("At what temperature (in Celsius) does water boil? Answer with only the number.", "100"),
    # Math
    ("What is 12 multiplied by 12? Answer with only the number.", "144"),
    ("What is the square root of 64? Answer with only the number.", "8"),
    ("What is 15 plus 27? Answer with only the number.", "42"),
    ("What is 100 divided by 4? Answer with only the number.", "25"),
    ("What is 5 squared? Answer with only the number.", "25"),
    # History
    ("In what year did the Titanic sink? Answer with only the year.", "1912"),
    ("Who painted the Mona Lisa? Answer with only the last name.", "da vinci"),
    ("In what year did World War II end? Answer with only the year.", "1945"),
    ("Who invented the lightbulb? Answer with only the last name.", "edison"),
    ("Who was the first president of the United States? Answer with only the last name.", "washington"),
]

for i, (prompt, expected) in enumerate(hallu_data, start=6):
    new_prompts.append({
        "id": f"fact_{i:03d}",
        "category": "hallucination",
        "prompt": prompt,
        "expected": expected,
        "scorer": "exact_match",
        "baseline_type": "static_ground_truth"
    })


# FORMAT ADHERENCE
fmt_data = [
    # Person
    (["name", "email", "role"], "Return a JSON object with keys \"name\", \"email\", and \"role\" describing a fictional person. Return only the JSON, no other text."),
    (["first_name", "last_name", "phone"], "Return a JSON object with keys \"first_name\", \"last_name\", and \"phone\" describing a fictional contact. Return only the JSON."),
    (["username", "password", "last_login"], "Return a JSON object with keys \"username\", \"password\", and \"last_login\" for a user. Return only the JSON."),
    (["employee_id", "department", "salary"], "Return a JSON object with keys \"employee_id\", \"department\", and \"salary\" for a worker. Return only the JSON."),
    (["customer_id", "status", "lifetime_value"], "Return a JSON object with keys \"customer_id\", \"status\", and \"lifetime_value\". Return only the JSON."),
    # Product
    (["product_name", "price", "category"], "Return a JSON object with keys \"product_name\", \"price\", and \"category\" describing a fictional product. Return only the JSON."),
    (["sku", "stock_count", "warehouse"], "Return a JSON object with keys \"sku\", \"stock_count\", and \"warehouse\" for an inventory item. Return only the JSON."),
    (["brand", "model", "color"], "Return a JSON object with keys \"brand\", \"model\", and \"color\" for a car. Return only the JSON."),
    (["item_id", "weight", "dimensions"], "Return a JSON object with keys \"item_id\", \"weight\", and \"dimensions\" for a package. Return only the JSON."),
    (["software", "version", "license"], "Return a JSON object with keys \"software\", \"version\", and \"license\" for a program. Return only the JSON."),
    # Event
    (["event_name", "date", "location"], "Return a JSON object with keys \"event_name\", \"date\", and \"location\" for a fictional event. Return only the JSON."),
    (["conference", "attendees", "topic"], "Return a JSON object with keys \"conference\", \"attendees\", and \"topic\" for a tech event. Return only the JSON."),
    (["concert_name", "band", "venue"], "Return a JSON object with keys \"concert_name\", \"band\", and \"venue\" for a music concert. Return only the JSON."),
    (["flight_number", "departure", "arrival"], "Return a JSON object with keys \"flight_number\", \"departure\", and \"arrival\" for a flight. Return only the JSON."),
    (["match_id", "home_team", "away_team"], "Return a JSON object with keys \"match_id\", \"home_team\", and \"away_team\" for a sports game. Return only the JSON."),
    # Technical
    (["endpoint", "method", "status_code"], "Return a JSON object with keys \"endpoint\", \"method\", and \"status_code\" for an API request. Return only the JSON."),
    (["ip_address", "mac_address", "hostname"], "Return a JSON object with keys \"ip_address\", \"mac_address\", and \"hostname\" for a server. Return only the JSON."),
    (["database", "table", "row_count"], "Return a JSON object with keys \"database\", \"table\", and \"row_count\" for a db query. Return only the JSON."),
    (["error_code", "message", "timestamp"], "Return a JSON object with keys \"error_code\", \"message\", and \"timestamp\" for a log entry. Return only the JSON."),
    (["service", "uptime", "latency"], "Return a JSON object with keys \"service\", \"uptime\", and \"latency\" for a microservice. Return only the JSON."),
]

for i, (keys, prompt) in enumerate(fmt_data, start=6):
    new_prompts.append({
        "id": f"fmt_{i:03d}",
        "category": "format_adherence",
        "prompt": prompt,
        "required_keys": keys,
        "scorer": "json_valid",
        "baseline_type": "deterministic"
    })

# INSTRUCTION FOLLOWING
inst_data = [
    # Programming
    (5, "List exactly 5 programming languages. One per line, nothing else."),
    (3, "List exactly 3 web frameworks. One per line, nothing else."),
    (4, "List exactly 4 types of databases. One per line, nothing else."),
    (2, "List exactly 2 operating systems. One per line, nothing else."),
    (6, "List exactly 6 design patterns. One per line, nothing else."),
    # Science
    (3, "List exactly 3 fields of physics. One per line, nothing else."),
    (4, "List exactly 4 chemical elements. One per line, nothing else."),
    (5, "List exactly 5 human organs. One per line, nothing else."),
    (2, "List exactly 2 types of energy. One per line, nothing else."),
    (7, "List exactly 7 bones in the human body. One per line, nothing else."),
    # Everyday
    (4, "List exactly 4 items you find in a kitchen. One per line, nothing else."),
    (5, "List exactly 5 types of furniture. One per line, nothing else."),
    (3, "List exactly 3 modes of transportation. One per line, nothing else."),
    (6, "List exactly 6 office supplies. One per line, nothing else."),
    (8, "List exactly 8 items of clothing. One per line, nothing else."),
    # Abstract
    (3, "List exactly 3 human emotions. One per line, nothing else."),
    (5, "List exactly 5 personality traits. One per line, nothing else."),
    (4, "List exactly 4 forms of art. One per line, nothing else."),
    (2, "List exactly 2 philosophical concepts. One per line, nothing else."),
    (7, "List exactly 7 virtues. One per line, nothing else.")
]

for i, (count, prompt) in enumerate(inst_data, start=6):
    new_prompts.append({
        "id": f"inst_{i:03d}",
        "category": "instruction_following",
        "prompt": prompt,
        "expected_count": count,
        "scorer": "exact_count",
        "baseline_type": "deterministic"
    })

# VERBOSITY
verb_data = [
    # Technical explanations
    "Explain how a combustion engine works.",
    "Explain how the internet routes packets.",
    "Explain the concept of public key cryptography.",
    "Explain how a refrigerator keeps things cold.",
    "Explain how airplanes generate lift.",
    # Concept definitions
    "What is quantum entanglement?",
    "What is inflation in economics?",
    "What is the theory of relativity?",
    "What is artificial intelligence?",
    "What is a black hole?",
    # Comparisons
    "What is the difference between an asteroid and a comet?",
    "What is the difference between mitosis and meiosis?",
    "What is the difference between weather and climate?",
    "What is the difference between a virus and a bacteria?",
    "What is the difference between RAM and ROM?",
    # Descriptions
    "Describe the process of making glass.",
    "Describe the lifecycle of a butterfly.",
    "Describe the structure of a DNA molecule.",
    "Describe the layers of the Earth.",
    "Describe the history of the printing press."
]

for i, prompt in enumerate(verb_data, start=6):
    new_prompts.append({
        "id": f"verb_{i:03d}",
        "category": "verbosity",
        "prompt": prompt,
        "scorer": "token_count",
        "baseline_type": "rolling_median"
    })


v2_data = {
    "version": "v2",
    "created_date": "2026-06-23",
    "prompts": v1_data["prompts"] + new_prompts
}

with open('harness/prompts/prompts_v2.json', 'w') as f:
    json.dump(v2_data, f, indent=2)

print("Generated prompts_v2.json successfully")
