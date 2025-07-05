. "$PSScriptRoot\..\interactive-script-ps.ps1"

# Define the long text using a here-string
$longText = @"
In a quiet valley nestled between tall mountains and peaceful rivers, there was a village that thrived for many generations. The villagers lived simple yet fulfilling lives, working the land, raising animals, and crafting tools that were known across nearby regions. Among them was a young woman named Elena, known for her curiosity and boundless energy. Every morning, she walked through the fields with a sense of wonder, observing the changing seasons, the songs of birds, and the gentle rustle of leaves in the breeze.
Elena’s family had tended their farm for decades, passing knowledge from one generation to the next. Her father taught her how to plant seeds, care for the animals, and fix broken tools, while her mother showed her how to weave cloth, prepare meals, and keep the household in order. But what set Elena apart was her love for learning and her desire to explore beyond the boundaries of the village.
One autumn, travelers arrived from a distant town, bringing news of a great fair where people from many lands gathered to exchange goods, stories, and ideas. Elena was fascinated by their tales and decided she would make the journey herself. Though her parents were hesitant, they saw the determination in her eyes and offered their support. With a small pack of food and a heart full of excitement, Elena set out at dawn, following winding paths through forests and meadows.
Along the way, she met a wide range of people — an old shepherd who shared wisdom about the stars, a merchant who taught her the art of negotiation, and a young artist who showed her how to see beauty in the simplest things. Each encounter left her a little wiser, a little stronger, and even more eager to continue. As she traveled, she also faced challenges: sudden storms, unfamiliar terrain, and moments of doubt. But each time, she remembered the lessons from her village — to stay calm, to think carefully, and to lean on the kindness of others when needed.
When Elena finally reached the fair, she was overwhelmed by its colors, sounds, and scents. Stalls lined every street, filled with spices, fabrics, tools, and treasures she had never seen before. Musicians played joyful songs, dancers spun in the square, and storytellers gathered crowds with tales of distant lands. Elena spent days exploring, making friends, and learning about the world beyond her home.
When she returned to the village, she brought more than goods — she brought stories, ideas, and a new spirit of curiosity. The villagers gathered to hear her tales, and soon, they too began to look outward, eager to connect with others and share what made their village special. Over time, the small valley became known not only for its beauty but for its openness, its learning, and its warmth.
And so, through one young woman’s journey, an entire community grew stronger, more connected, and ready to face whatever lay ahead.
"@

# Display the long text using the ui.show_text method
$ui.show_text("Elena's Journey: A Tale of Curiosity", $longText)

$ui.Log("Long text displayed.")