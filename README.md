# Triply.today

Triply.today is a full-stack AI-powered travel web application that generates personalized trip content using modern web technologies.
It integrates AI, a structured database, and a responsive frontend to deliver a seamless user experience.

---

## Features

- AI-powered trip and packing list generation using Google Gemini API
- Saving and editing generated trip plans
- Exporting plans to pdf
- Database integration with Prisma ORM  
- Fast and optimized frontend built with Next.js & TypeScript  

---

## Tech Stack

- **Frontend:** Next.js (React), TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes  
- **Database:** Prisma ORM  
- **AI Integration:** Google Gemini API  

---

# Screenshots
<img width="1920" height="1080" alt="Screenshot (229)" src="https://github.com/user-attachments/assets/cfd73491-6c49-493d-83c1-f07f2cf1b541" />
<img width="1920" height="1080" alt="Screenshot (230)" src="https://github.com/user-attachments/assets/606ab605-a236-4ffd-be68-b5e4333de96f" />
<img width="1920" height="1080" alt="Screenshot (224)" src="https://github.com/user-attachments/assets/a3e66fb3-eed3-48c3-b844-e69805ca9ab7" />
<img width="1920" height="1080" alt="Screenshot (225)" src="https://github.com/user-attachments/assets/bac3f116-6d12-469f-8976-7ce086d7f2d1" />
<img width="1920" height="1080" alt="Screenshot (226)" src="https://github.com/user-attachments/assets/b7dc23cf-c5ef-43d0-a540-f9ea55356a21" />
<img width="1920" height="1080" alt="Screenshot (227)" src="https://github.com/user-attachments/assets/2d37c89a-7562-4774-9e66-d768d8d0b6ed" />
<img width="1920" height="1080" alt="Screenshot (228)" src="https://github.com/user-attachments/assets/edfeb3da-e1f7-4e82-95cd-e5157c70b332" />

---

# Setting Up `.env`

Follow these steps to create and configure a `.env` file in the root directory of your project:

1. **Create the File**  
    Create a new file named `.env` in the root directory where `package.json` is located.

2. **Edit the File**  
    Open the `.env` file in a text editor or VS Code.

3. **Add the API Key**  
    Add the following line to the file:
    ```env
    GEMINI_API=YOUR_API_KEY_HERE
    ```
    Replace `YOUR_API_KEY_HERE` with your actual Gemini API key, which you can obtain for free from [Google AI Studio](https://ai.google/studio).

4. **Save the File**  
    Save the `.env` file after making the changes.

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

**Reminder:** Ensure your `.env` file is correctly configured before building.


