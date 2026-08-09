from app.ai.food.vision import analyze_food_image


class AIService:

    @staticmethod
    def generate_suggestions(
        category: str,
        image_path: str
    ):

        if category.lower() == "food":

            return analyze_food_image(
                image_path
            )

        raise ValueError(
            f"AI support for '{category}' is not available yet"
        )