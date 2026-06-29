const axios = require('axios');

async function verify() {
  try {
    console.log("--- Fetching Homepage ---");
    const { data: homeHtml } = await axios.get('http://localhost:3000');
    console.log(homeHtml.includes('Behaving normally') ? "✅ Found 'Behaving normally'" : "❌ Missing 'Behaving normally'");
    console.log(homeHtml.includes('bsi') ? "❌ Error: BSI found on homepage" : "✅ No BSI on homepage");
    
    // Attempting to extract some visible text for the report
    const titleMatch = homeHtml.match(/<h1[^>]*>(.*?)<\/h1>/);
    console.log("Homepage H1:", titleMatch ? titleMatch[1] : "Not found");

    console.log("\n--- Fetching Model Detail ---");
    const { data: detailHtml } = await axios.get('http://localhost:3000/models/ollama%2Fllama3');
    console.log(detailHtml.includes('Factual accuracy') ? "✅ Found 'Factual accuracy' category mapping" : "❌ Missing mapping");
    console.log(detailHtml.includes('Response length consistency') ? "✅ Found 'Response length consistency' mapping" : "❌ Missing mapping");
    console.log(detailHtml.includes('bsi') ? "❌ Error: BSI found on model detail" : "✅ No BSI on model detail");

    console.log("\n--- Fetching Technical Report ---");
    const { data: reportHtml } = await axios.get('http://localhost:3000/reports/ollama%2Fllama3');
    console.log(reportHtml.includes('Overall BSI Score') ? "✅ Found 'Overall BSI Score'" : "❌ Missing BSI Score header");
    console.log(reportHtml.includes('Z-Score') ? "✅ Found 'Z-Score'" : "❌ Missing 'Z-Score'");
    console.log(reportHtml.includes('Cohen&#x27;s d') || reportHtml.includes("Cohen's d") ? "✅ Found Cohen's d" : "❌ Missing Cohen's d");
    
  } catch (err) {
    console.error("Fetch failed:", err.message);
  }
}

verify();
