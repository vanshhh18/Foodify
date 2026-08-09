FOOD_VISION_PROMPT = """
Analyze this food donation image.

Your job is to provide suggestions for a human who is creating a donation.

Identify ONLY information that can reasonably be determined from the image.

Rules:

1. title:
   Give a short name for the food.

2. description:
   Describe what is visibly present.

3. quantity:
   Estimate the quantity ONLY if it can reasonably be determined.
   If you cannot determine it, return null.
   NEVER invent a quantity.

4. diet_type:
   Use only:
   - vegetarian
   - non_vegetarian
   - vegan
   - unknown

5. condition:
   Describe the visible condition of the food.
   Do not make assumptions about freshness that cannot be seen.

6. confidence:
   Give an overall confidence score between 0 and 1.

IMPORTANT:
- These are AI suggestions, NOT final values.
- Never invent information.
- If something cannot be determined from the image, return null.
- A human will review and edit all suggestions.
"""