from datetime import date, datetime
from typing import Any, Dict, List, Optional

longText = "In a quiet valley nestled between tall mountains and peaceful rivers, there was a village that thrived for many generations. The villagers lived simple yet fulfilling lives, working the land, raising animals, and crafting tools that were known across nearby regions. Among them was a young woman named Elena, known for her curiosity and boundless energy. Every morning, she walked through the fields with a sense of wonder, observing the changing seasons, the songs of birds, and the gentle rustle of leaves in the breeze.\nElena’s family had tended their farm for decades, passing knowledge from one generation to the next. Her father taught her how to plant seeds, care for the animals, and fix broken tools, while her mother showed her how to weave cloth, prepare meals, and keep the household in order. But what set Elena apart was her love for learning and her desire to explore beyond the boundaries of the village.\nOne autumn, travelers arrived from a distant town, bringing news of a great fair where people from many lands gathered to exchange goods, stories, and ideas. Elena was fascinated by their tales and decided she would make the journey herself. Though her parents were hesitant, they saw the determination in her eyes and offered their support. With a small pack of food and a heart full of excitement, Elena set out at dawn, following winding paths through forests and meadows.\nAlong the way, she met a wide range of people — an old shepherd who shared wisdom about the stars, a merchant who taught her the art of negotiation, and a young artist who showed her how to see beauty in the simplest things. Each encounter left her a little wiser, a little stronger, and even more eager to continue. As she traveled, she also faced challenges: sudden storms, unfamiliar terrain, and moments of doubt. But each time, she remembered the lessons from her village — to stay calm, to think carefully, and to lean on the kindness of others when needed.\nWhen Elena finally reached the fair, she was overwhelmed by its colors, sounds, and scents. Stalls lined every street, filled with spices, fabrics, tools, and treasures she had never seen before. Musicians played joyful songs, dancers spun in the square, and storytellers gathered crowds with tales of distant lands. Elena spent days exploring, making friends, and learning about the world beyond her home.\nWhen she returned to the village, she brought more than goods — she brought stories, ideas, and a new spirit of curiosity. The villagers gathered to hear her tales, and soon, they too began to look outward, eager to connect with others and share what made their village special. Over time, the small valley became known not only for its beauty but for its openness, its learning, and its warmth.\nAnd so, through one young woman’s journey, an entire community grew stronger, more connected, and ready to face whatever lay ahead."

def get_row(index: int):
    return {
        "name": f"Item {index}",
        "description": f"Description for item {index}",
        "value": index,
        "timestamp": datetime.now().isoformat() + "Z",  # Mimic UTC ISO string
        "isActive": index % 2 == 0,
        "isSelected": index % 3 == 0,
        "city": f"City {index}",
        "country": f"Country {index}",
        "address": f"Address {index}",
        "phone": f"{str(index)[0]*3}-{(str(index)[1] if len(str(index)) > 1 else '0')*3}-{(str(index)[2:] if len(str(index)) > 2 else '0000')}",
    }

def generate_rows(count: int):
    return [get_row(i + 1) for i in range(count)]


class NestedObject:
    def __init__(self, label: str, value: int):
        self.label = label
        self.value = value

    def __repr__(self):
        return f"<NestedObject label={self.label}, value={self.value}>"

# This class is used to generate a list of objects with various data types
# for data serialization tests.
# But to display it in the grid you need to generate plane objects 
# to display them properly.
class DataRow:
    def __init__(self, index: int):
        # Basic types
        self.name: str = f"Item {index}"
        self.value: int = index
        self.active: bool = index % 2 == 0
        self.score: float = index * 1.5

        # Complex types
        self.created_at: datetime = datetime.now()
        self.birthdate: Optional[date] = date.today() if index % 5 == 0 else None

        self.tags: List[str] = [f"tag{index}", "example"]
        self.metadata: Dict[str, Any] = {
            "key1": "value1",
            "key2": 42,
            "key3": True,
        }

        self.notes: Optional[str] = None if index % 4 == 0 else "Some notes"

        # Nested object
        self.nested: NestedObject = NestedObject(f"Label {index}", index * 10)

        # List of nested objects
        self.history: List[NestedObject] = [
            NestedObject(f"Old {index}", index - 1),
            NestedObject(f"New {index}", index + 1)
        ]

    def __repr__(self):
        return f"<DataRow name={self.name} value={self.value}>"

def generate_class_rows(count: int) -> List[DataRow]:
    return [DataRow(i + 1) for i in range(count)]