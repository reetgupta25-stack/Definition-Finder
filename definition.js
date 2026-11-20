const API_KEY = "Add your api key ";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;
const inputText = document.getElementById("inputtext");
const output = document.getElementById("output");
const button = document.getElementById("button");

async function finddef() {
    const word = inputText.value.trim();

    if (!word) {
        output.textContent = "Please enter a word or concept.";
        return;
    }

    output.textContent = "Finding definition...";
    button.disabled = true;

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `Explain "${word}" in simple language.

Include:
1. Definition
2. Simple explanation
3. One practical example

Use clear, natural plain text. Do not use Markdown symbols such as **, ##, *, or backticks.
Avoid unnecessary blank lines, extra spaces, and decorative symbols.`
                    }]
                }]
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error?.message || "API request failed.");
        }

        let definition = data.candidates?.[0]?.content?.parts
            ?.map(part => part.text || "")
            .join("")
            .trim() || "No definition generated.";

        definition = definition
            .replace(/\*\*(.*?)\*\*/g, "$1")
            .replace(/\*(.*?)\*/g, "$1")
            .replace(/^#{1,6}\s*/gm, "")
            .replace(/`([^`]+)`/g, "$1")
            .replace(/\n{3,}/g, "\n\n")
            .trim();

        output.textContent = definition;
    } catch (error) {
        output.textContent = error.message || "Something went wrong.";
        console.error(error);
    } finally {
        button.disabled = false;
    }
}

button.addEventListener("click", finddef);

inputText.addEventListener("keydown", event => {
    if (event.key === "Enter") {
        finddef();
    }
});