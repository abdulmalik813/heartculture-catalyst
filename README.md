# Base App by NightTech Services

This is the base application for [NightTech Services](https://github.com/NightTech-Services), built with [Next.js](https://nextjs.org/) and [Payload CMS](https://payloadcms.com/).

## Getting Started

To get started with this project, follow these steps:

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/NightTech-Services/base-app.git
    cd base-app
    ```

2.  **Install dependencies:**

    ```bash
    pnpm i
    ```

3.  **Copy the example environment variables:**

    ```bash
    cp .env.example .env
    ```

    You'll need to fill out the `.env` file with your own information, such as your database connection string.

4.  **Run the development server:**

    ```bash
    pnpm dev
    ```

    Your site will be available at `http://localhost:3000`, and you can access the Payload admin panel at `http://localhost:3000/admin`.

## Features

*   **Next.js App Router:** Uses the latest Next.js App Router for routing and layouts.
*   **Payload CMS:** A powerful, headless CMS for managing your content.
*   **Pre-configured Collections:** Includes a set of pre-configured collections, such as `pages`, `posts`, `media`, and `users`.
*   **Custom Blocks:** A variety of custom blocks for building your pages.
*   **Shadcn UI:** A collection of re-usable UI components.
*   **Dark Mode:** Includes a dark mode theme that can be toggled by the user.
*   **Docker Support:** Includes a `docker-compose.yml` file for running the project with Docker.

## Deployment

You can deploy this project to any platform that supports Next.js and Node.js. For a seamless experience, consider using [Payload Cloud](https://payloadcms.com/cloud), which is designed to host Payload applications.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request if you have any improvements or suggestions.

## License

This project is licensed under the MIT License.