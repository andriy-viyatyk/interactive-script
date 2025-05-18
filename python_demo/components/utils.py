from datetime import date, datetime
from typing import Any, Dict, List, Optional

def get_row(index: int) -> dict:
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

def generate_rows(count: int) -> list[dict]:
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