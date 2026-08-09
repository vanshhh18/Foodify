import base64

from langchain_core.messages import HumanMessage, SystemMessage
from langchain_groq import ChatGroq

from app.config import GROQ_API_KEY

from app.ai.food.prompts import FOOD_VISION_PROMPT
from app.ai.food.schemas import FoodAISuggestion


llm = ChatGroq(
    model="qwen/qwen3.6-27b",
    api_key=GROQ_API_KEY,
    temperature=0
)


food_vision_llm = llm.with_structured_output(
    FoodAISuggestion
)


def analyze_food_image(image_path: str) -> FoodAISuggestion:

    with open(image_path, "rb") as image_file:

        image_data = base64.b64encode(
            image_file.read()
        ).decode("utf-8")

    message = HumanMessage(
        content=[
            {
                "type": "text",
                "text": (
                    "Analyze this food donation image "
                    "and return the structured AI draft."
                )
            },
            {
                "type": "image_url",
                "image_url": {
                    "url": (
                        f"data:image/jpeg;base64,{image_data}"
                    )
                }
            }
        ]
    )

    result = food_vision_llm.invoke(
        [
            SystemMessage(
                content=FOOD_VISION_PROMPT
            ),
            message
        ]
    )

    return result