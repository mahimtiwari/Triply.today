# Setting Up `.env.local`

To ensure the code works correctly, follow these steps to create and configure a `.env.local` file where `package.json` is present:

1. In the root directory of your project, create a new file named `.env.local`.
2. Open the `.env.local` file in a text editor or VScode...
3. Add the following line to the file:
    ```
    GEMINI_API=YOUR_API_KEY_HERE
    ```
4. Replace `YOUR_API_KEY_HERE` with your actual Gemini API key, which you can obtain for free from [Google AI Studio](https://ai.google/studio).

Save the file, and you're all set!

## Running the Development Server

Once your `.env.local` file is set up, you can start the development server by running the following command in your terminal:

```bash
npm run dev
```

This will start the application in development mode. You can access it by navigating to `http://localhost:3000` or on your own LAN server in your web browser.

If you encounter any issues, ensure that all dependencies are installed by running:

```bash
npm install
```

Happy coding!