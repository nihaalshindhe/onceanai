import google.generativeai as genai

genai.configure(api_key=#add env variable for api key here)

def generate_text(prompt: str):
    model = genai.GenerativeModel("gemini-pro")
    response = model.generate_content(prompt)
    return response.text
