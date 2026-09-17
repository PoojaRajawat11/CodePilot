import groq from "./config/groq.js";

try {
  const chatCompletion = await groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: "Say Hello from Groq",
      },
    ],
    model: "llama-3.3-70b-versatile",
  });

  console.log(chatCompletion.choices[0].message.content);
} catch (err) {
  console.error(err);
}