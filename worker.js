
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/contact") {
      if (request.method !== "POST") {
        return Response.json(
          { error: "Method not allowed." },
          {
            status: 405,
            headers: { Allow: "POST" }
          }
        );
      }

      try {
        const contentType =
          request.headers.get("content-type") || "";

        if (!contentType.includes("application/json")) {
          return Response.json(
            { error: "Invalid request format." },
            { status: 415 }
          );
        }

        const data = await request.json();

        const name =
          typeof data.name === "string" ? data.name.trim() : "";
        const email =
          typeof data.email === "string" ? data.email.trim() : "";
        const message =
          typeof data.message === "string"
            ? data.message.trim()
            : "";

        if (
          !name ||
          name.length > 100 ||
          !email ||
          email.length > 254 ||
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
          !message ||
          message.length > 5000
        ) {
          return Response.json(
            {
              error: "Please check your name, email, and message."
            },
            { status: 400 }
          );
        }

        await env.DB.prepare(
          `INSERT INTO contact_messages (name, email, message)
           VALUES (?, ?, ?)`
        )
          .bind(name, email, message)
          .run();

        return Response.json(
          {
            success: true,
            message: "Your message has been submitted successfully."
          },
          { status: 201 }
        );
      } catch (error) {
        console.error("Contact form error:", error);

        return Response.json(
          {
            error: "Unable to save your message. Please try again later."
          },
          { status: 500 }
        );
      }
    }

    return env.ASSETS.fetch(request);
  }
};
