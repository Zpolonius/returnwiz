# Vi starter med et letvægts Python billede
FROM python:3.11-slim

# Sætter arbejdsmappen inde i containeren
WORKDIR /app

# Installerer systemafhængigheder (nødvendigt for postgres driver)
RUN apt-get update && apt-get install -y libpq-dev gcc

# Kopierer requirements og installerer dem
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Kopierer resten af koden
COPY . .

# Kommandoen der starter serveren (med 'reload' så du kan se ændringer live)
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]