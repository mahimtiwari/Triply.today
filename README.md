# Setting Up `.env.local`

Follow these steps to create and configure a `.env.local` file in the root directory of your project:

1. **Create the File**  
    Create a new file named `.env.local` in the root directory where `package.json` is located.

2. **Edit the File**  
    Open the `.env.local` file in a text editor or VS Code.

3. **Add the API Key**  
    Add the following line to the file:
    ```env
    GEMINI_API=YOUR_API_KEY_HERE
    ```
    Replace `YOUR_API_KEY_HERE` with your actual Gemini API key, which you can obtain for free from [Google AI Studio](https://ai.google/studio).

4. **Save the File**  
    Save the `.env.local` file after making the changes.

---

# Performing a Development Build

To perform a development build:

1. **Update the Prisma Configuration**  
    Navigate to the `/prisma/schema.prisma` file and update the `datasource db` configuration as follows:
    ```prisma
    datasource db {
      provider = "sqlite"
      url      = "file:../db/dev.db"
    }
    ```
    Save the file after making the changes.

2. **Build the Project**  
    Run the following command in your terminal:
    ```bash
    npm run dev
    ```
    This will create an optimized build of your application for development purposes.

**Reminder:** Ensure your `.env.local` file is correctly configured before building.
