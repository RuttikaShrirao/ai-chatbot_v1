import { createUIMessageStream, createUIMessageStreamResponse } from 'ai';

export function createMockStreamResponse(userPrompt: string): Response {
  const promptLower = userPrompt.toLowerCase();

  let responseText = '';

  if (promptLower.includes('quantum')) {
    responseText = `### 🌌 Understanding Quantum Computing Simply

Imagine a conventional computer is like a **light switch**: it can only be **OFF (0)** or **ON (1)**. Every calculation is made by flipping billions of these switches step-by-step.

A **Quantum Computer**, on the other hand, operates using **qubits** which behave like a spinning coin:

1. **Superposition**: While the coin is spinning on a tabletop, it is neither purely heads nor tails—it is a blur of *both* at the same time. This allows quantum computers to evaluate vast numbers of possibilities simultaneously.
2. **Entanglement**: Imagine two magic coins. Even if separated by miles, whenever one coin lands on heads, the other instantaneously lands on tails. Qubits link together in ways that classical bits cannot.
3. **Quantum Interference**: Quantum algorithms amplify the correct answer pathways while canceling out wrong answers, like ripples in a pond merging and canceling each other.

\`\`\`python
# Quantum computing concept in Qiskit
from qiskit import QuantumCircuit

# Create a quantum circuit with 1 qubit
qc = QuantumCircuit(1)

# Apply a Hadamard gate to put qubit into superposition
qc.h(0)
print(qc)
\`\`\`

> **Key Takeaway:** Quantum computers are not just faster standard computers; they solve complex combinatorial problems (drug discovery, cryptography, materials science) fundamentally differently!`;
  } else if (promptLower.includes('scrape') || promptLower.includes('python')) {
    responseText = `Here is a complete, production-ready Python web scraper using \`BeautifulSoup\` and \`requests\`:

\`\`\`python
import requests
from bs4 import BeautifulSoup
import time

def scrape_headlines(url: str):
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
    }

    try:
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()

        soup = BeautifulSoup(response.text, "html.parser")
        headlines = []

        # Find headline elements (e.g., h2 or h3 with article title)
        for item in soup.find_all(["h2", "h3"], limit=10):
            title = item.get_text(strip=True)
            link = item.find("a")["href"] if item.find("a") and item.find("a").has_attr("href") else None
            if title:
                headlines.append({"title": title, "link": link})

        return headlines

    except requests.exceptions.RequestException as e:
        print(f"Error fetching page: {e}")
        return []

if __name__ == "__main__":
    target_url = "https://news.ycombinator.com"
    results = scrape_headlines(target_url)
    for idx, item in enumerate(results, 1):
        print(f"{idx}. {item['title']}")
\`\`\`

### 🛡️ Best Practices:
- **Respect robots.txt**: Always check if scraping is allowed.
- **Add delays**: Avoid overwhelming the server with \`time.sleep(1)\`.
- **Handle rate limits & headers**: Always specify a genuine User-Agent.`;
  } else if (promptLower.includes('router') || promptLower.includes('next.js') || promptLower.includes('pages')) {
    responseText = `### ⚡ Next.js App Router vs Pages Router

Here is a side-by-side comparison of the two Next.js routing paradigms:

| Feature | App Router (\`app/\`) | Pages Router (\`pages/\`) |
| :--- | :--- | :--- |
| **Component Paradigm** | React Server Components (RSC) by default | Client Components by default |
| **Data Fetching** | Native \`async/await\` in Server Components | \`getServerSideProps\`, \`getStaticProps\` |
| **Layouts** | Nested layouts with state preservation | Custom \`_app.tsx\` wrapper boilerplate |
| **Streaming & Suspense**| First-class support with \`loading.tsx\` | Limited / requires custom setup |
| **Directory Structure** | File-system with route colocation | Direct file-to-route mapping |

#### 💡 When to use what?
- **App Router**: Recommended for all new greenfield applications. Provides optimal bundle sizes, streaming UI, and modern React 19 features.
- **Pages Router**: Maintained for backwards compatibility in existing legacy codebases.`;
  } else {
    responseText = `Hello! I'm **Nexus AI**, running with real-time progressive streaming via Vercel AI SDK.

You asked:
> *${userPrompt}*

Here are key insights regarding your question:
1. **Real-time Processing**: This response is streaming token-by-token directly to your browser using Server-Sent Events.
2. **Context Retention**: Our session history persists automatically in your browser's local storage across page refreshes.
3. **Multi-Model Ready**: You can switch providers (Groq, Fireworks.ai, OpenAI) using the model dropdown above anytime.

\`\`\`json
{
  "status": "streaming_active",
  "engine": "Vercel AI SDK (App Router)",
  "session": "persistent_localStorage",
  "timestamp": "${new Date().toISOString()}"
}
\`\`\`

How else can I assist you today? Feel free to ask about code, algorithms, architecture, or creative writing!`;
  }

  // Break text into realistic chunks (words / syllables)
  const words = responseText.split(/(?<=\s|\\n)/);

  const stream = createUIMessageStream({
    async execute({ writer }) {
      const partId = 'text-part-1';
      writer.write({ type: 'text-start', id: partId });

      for (const word of words) {
        writer.write({
          type: 'text-delta',
          id: partId,
          delta: word,
        });
        // Realistic streaming delay (15-35ms)
        await new Promise((resolve) => setTimeout(resolve, 20));
      }

      writer.write({ type: 'text-end', id: partId });
      writer.write({ type: 'finish', finishReason: 'stop' });
    },
  });

  return createUIMessageStreamResponse({ stream });
}
