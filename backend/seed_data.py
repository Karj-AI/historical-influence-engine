"""
Run once to populate the database with sample data.
Run with: python seed_data.py
"""
from app import app
from models import db, Country, Person

COUNTRIES = [
    {"name": "Italy", "region": "Southern Europe", "continent": "Europe", "latitude": 41.9, "longitude": 12.6},
    {"name": "Egypt", "region": "North Africa", "continent": "Africa", "latitude": 26.8, "longitude": 30.8},
    {"name": "China", "region": "East Asia", "continent": "Asia", "latitude": 35.9, "longitude": 104.2},
    {"name": "Greece", "region": "Southern Europe", "continent": "Europe", "latitude": 39.0, "longitude": 22.0},
    {"name": "India", "region": "South Asia", "continent": "Asia", "latitude": 22.0, "longitude": 79.0},
    {"name": "France", "region": "Western Europe", "continent": "Europe", "latitude": 46.6, "longitude": 2.2},
    {"name": "England", "region": "Western Europe", "continent": "Europe", "latitude": 52.3, "longitude": -1.5},
    {"name": "Spain", "region": "Southern Europe", "continent": "Europe", "latitude": 40.4, "longitude": -3.7},
    {"name": "Persia", "region": "Middle East", "continent": "Asia", "latitude": 32.4, "longitude": 53.7},
    {"name": "Japan", "region": "East Asia", "continent": "Asia", "latitude": 36.2, "longitude": 138.2},
    {"name": "Mongolia", "region": "Central Asia", "continent": "Asia", "latitude": 46.8, "longitude": 103.8},
    {"name": "Russia", "region": "Eastern Europe", "continent": "Europe", "latitude": 61.5, "longitude": 105.3},
    {"name": "Germany", "region": "Central Europe", "continent": "Europe", "latitude": 51.1, "longitude": 10.4},
    {"name": "Turkey", "region": "Middle East", "continent": "Asia", "latitude": 38.9, "longitude": 35.2},
    {"name": "Mexico", "region": "Central America", "continent": "North America", "latitude": 23.6, "longitude": -102.5},
]

PEOPLE = {
    "Italy": [
        {"name": "Julius Caesar", "era_start": -100, "era_end": -44,
         "description": "Roman general and statesman whose campaigns reshaped the Republic and paved the way for the Empire.",
         "global_impact": 95, "longevity": 92, "cross_region_impact": 85},
        {"name": "Augustus", "era_start": -63, "era_end": 14,
         "description": "First Roman emperor, founder of the Pax Romana.",
         "global_impact": 90, "longevity": 88, "cross_region_impact": 80},
        {"name": "Leonardo da Vinci", "era_start": 1452, "era_end": 1519,
         "description": "Renaissance polymath whose art, anatomy, and engineering work shaped centuries of science and culture.",
         "global_impact": 92, "longevity": 90, "cross_region_impact": 88},
        {"name": "Galileo Galilei", "era_start": 1564, "era_end": 1642,
         "description": "Astronomer whose support for heliocentrism helped launch the scientific revolution.",
         "global_impact": 88, "longevity": 85, "cross_region_impact": 82},
        {"name": "Dante Alighieri", "era_start": 1265, "era_end": 1321,
         "description": "Poet whose 'Divine Comedy' shaped the Italian language and Western literature.",
         "global_impact": 75, "longevity": 80, "cross_region_impact": 65},
    ],
    "Egypt": [
        {"name": "Ramesses II", "era_start": -1303, "era_end": -1213,
         "description": "One of ancient Egypt's most powerful pharaohs, known for monumental building and military campaigns.",
         "global_impact": 80, "longevity": 90, "cross_region_impact": 65},
        {"name": "Cleopatra VII", "era_start": -69, "era_end": -30,
         "description": "Last active ruler of the Ptolemaic Kingdom, whose alliances shaped the late Roman Republic.",
         "global_impact": 85, "longevity": 88, "cross_region_impact": 80},
        {"name": "Imhotep", "era_start": -2650, "era_end": -2600,
         "description": "Architect and physician credited with designing the Step Pyramid.",
         "global_impact": 70, "longevity": 92, "cross_region_impact": 50},
        {"name": "Hatshepsut", "era_start": -1507, "era_end": -1458,
         "description": "One of the few female pharaohs, known for extensive trade expeditions.",
         "global_impact": 68, "longevity": 85, "cross_region_impact": 55},
        {"name": "Anwar Sadat", "era_start": 1918, "era_end": 1981,
         "description": "President of Egypt who negotiated the Egypt-Israel peace treaty.",
         "global_impact": 72, "longevity": 60, "cross_region_impact": 78},
    ],
    "China": [
        {"name": "Confucius", "era_start": -551, "era_end": -479,
         "description": "Philosopher whose teachings became the foundation of Confucianism across East Asia.",
         "global_impact": 90, "longevity": 97, "cross_region_impact": 75},
        {"name": "Qin Shi Huang", "era_start": -259, "era_end": -210,
         "description": "First emperor of a unified China, standardized writing and currency, began the Great Wall.",
         "global_impact": 85, "longevity": 90, "cross_region_impact": 60},
        {"name": "Sun Tzu", "era_start": -544, "era_end": -496,
         "description": "Military strategist whose 'The Art of War' remains globally influential.",
         "global_impact": 82, "longevity": 93, "cross_region_impact": 85},
        {"name": "Mao Zedong", "era_start": 1893, "era_end": 1976,
         "description": "Founding leader of the People's Republic of China.",
         "global_impact": 88, "longevity": 65, "cross_region_impact": 80},
        {"name": "Deng Xiaoping", "era_start": 1904, "era_end": 1997,
         "description": "Leader whose economic reforms opened China to global markets.",
         "global_impact": 80, "longevity": 60, "cross_region_impact": 85},
    ],
    "Greece": [
        {"name": "Alexander the Great", "era_start": -356, "era_end": -323,
         "description": "King of Macedon whose conquests spread Greek culture across three continents.",
         "global_impact": 96, "longevity": 90, "cross_region_impact": 92},
        {"name": "Socrates", "era_start": -470, "era_end": -399,
         "description": "Philosopher whose method of questioning shaped the foundations of Western philosophy.",
         "global_impact": 85, "longevity": 95, "cross_region_impact": 70},
        {"name": "Aristotle", "era_start": -384, "era_end": -322,
         "description": "Philosopher and scientist whose work influenced nearly every field of Western thought.",
         "global_impact": 92, "longevity": 96, "cross_region_impact": 80},
        {"name": "Pericles", "era_start": -495, "era_end": -429,
         "description": "Statesman who led Athens through its golden age of democracy and culture.",
         "global_impact": 75, "longevity": 82, "cross_region_impact": 55},
        {"name": "Homer", "era_start": -800, "era_end": -700,
         "description": "Poet credited with the Iliad and Odyssey, foundational texts of Western literature.",
         "global_impact": 78, "longevity": 92, "cross_region_impact": 60},
    ],
    "India": [
        {"name": "Ashoka the Great", "era_start": -304, "era_end": -232,
         "description": "Emperor who unified most of India and later promoted Buddhism across Asia.",
         "global_impact": 82, "longevity": 85, "cross_region_impact": 75},
        {"name": "Gautama Buddha", "era_start": -563, "era_end": -483,
         "description": "Founder of Buddhism, one of the world's major religions and philosophies.",
         "global_impact": 94, "longevity": 97, "cross_region_impact": 90},
        {"name": "Mahatma Gandhi", "era_start": 1869, "era_end": 1948,
         "description": "Leader of India's independence movement through nonviolent civil disobedience.",
         "global_impact": 90, "longevity": 70, "cross_region_impact": 88},
        {"name": "Akbar the Great", "era_start": 1542, "era_end": 1605,
         "description": "Mughal emperor known for religious tolerance and administrative reform.",
         "global_impact": 72, "longevity": 75, "cross_region_impact": 55},
        {"name": "Aryabhata", "era_start": 476, "era_end": 550,
         "description": "Mathematician and astronomer who made major advances in trigonometry and place-value notation.",
         "global_impact": 65, "longevity": 80, "cross_region_impact": 60},
    ],
    "France": [
        {"name": "Napoleon Bonaparte", "era_start": 1769, "era_end": 1821,
         "description": "Military leader and emperor whose conquests and legal code reshaped Europe.",
         "global_impact": 93, "longevity": 80, "cross_region_impact": 88},
        {"name": "Joan of Arc", "era_start": 1412, "era_end": 1431,
         "description": "Military leader who became a national symbol of France during the Hundred Years' War.",
         "global_impact": 70, "longevity": 85, "cross_region_impact": 55},
        {"name": "Voltaire", "era_start": 1694, "era_end": 1778,
         "description": "Writer and philosopher whose Enlightenment ideas influenced revolutions worldwide.",
         "global_impact": 80, "longevity": 78, "cross_region_impact": 75},
        {"name": "Marie Curie", "era_start": 1867, "era_end": 1934,
         "description": "Physicist and chemist, first person to win Nobel Prizes in two sciences.",
         "global_impact": 85, "longevity": 70, "cross_region_impact": 80},
        {"name": "Louis XIV", "era_start": 1638, "era_end": 1715,
         "description": "The 'Sun King', whose long reign centralized French royal power.",
         "global_impact": 68, "longevity": 65, "cross_region_impact": 50},
    ],
    "England": [
        {"name": "Isaac Newton", "era_start": 1643, "era_end": 1727,
         "description": "Physicist and mathematician whose laws of motion and gravity founded classical mechanics.",
         "global_impact": 94, "longevity": 90, "cross_region_impact": 85},
        {"name": "William Shakespeare", "era_start": 1564, "era_end": 1616,
         "description": "Playwright whose works remain foundational to English literature and theater worldwide.",
         "global_impact": 88, "longevity": 92, "cross_region_impact": 82},
        {"name": "Winston Churchill", "era_start": 1874, "era_end": 1965,
         "description": "Prime Minister who led Britain through World War II.",
         "global_impact": 85, "longevity": 60, "cross_region_impact": 78},
        {"name": "Queen Elizabeth I", "era_start": 1533, "era_end": 1603,
         "description": "Monarch whose reign is remembered as a golden age of English culture and naval power.",
         "global_impact": 75, "longevity": 75, "cross_region_impact": 60},
        {"name": "Charles Darwin", "era_start": 1809, "era_end": 1882,
         "description": "Naturalist whose theory of evolution transformed biology and human understanding of life.",
         "global_impact": 90, "longevity": 72, "cross_region_impact": 82},
    ],
    "Spain": [
        {"name": "Isabella I of Castile", "era_start": 1451, "era_end": 1504,
         "description": "Queen whose sponsorship of Columbus's voyages launched the Age of Exploration.",
         "global_impact": 82, "longevity": 70, "cross_region_impact": 85},
        {"name": "Miguel de Cervantes", "era_start": 1547, "era_end": 1616,
         "description": "Author of 'Don Quixote', considered the first modern novel.",
         "global_impact": 72, "longevity": 80, "cross_region_impact": 65},
        {"name": "Francisco Franco", "era_start": 1892, "era_end": 1975,
         "description": "Military dictator who ruled Spain for nearly four decades.",
         "global_impact": 60, "longevity": 45, "cross_region_impact": 50},
        {"name": "Hernan Cortes", "era_start": 1485, "era_end": 1547,
         "description": "Conquistador whose expedition led to the fall of the Aztec Empire.",
         "global_impact": 70, "longevity": 60, "cross_region_impact": 75},
    ],
    "Persia": [
        {"name": "Cyrus the Great", "era_start": -600, "era_end": -530,
         "description": "Founder of the Persian Empire, known for tolerant governance of conquered peoples.",
         "global_impact": 88, "longevity": 88, "cross_region_impact": 80},
        {"name": "Darius I", "era_start": -550, "era_end": -486,
         "description": "Persian king who expanded the empire and built its administrative system.",
         "global_impact": 78, "longevity": 80, "cross_region_impact": 70},
        {"name": "Rumi", "era_start": 1207, "era_end": 1273,
         "description": "Poet and mystic whose spiritual poetry remains widely read across the world.",
         "global_impact": 75, "longevity": 88, "cross_region_impact": 70},
        {"name": "Avicenna", "era_start": 980, "era_end": 1037,
         "description": "Physician and philosopher whose medical texts were standard references for centuries.",
         "global_impact": 78, "longevity": 85, "cross_region_impact": 72},
    ],
    "Japan": [
        {"name": "Tokugawa Ieyasu", "era_start": 1543, "era_end": 1616,
         "description": "Founder of the Tokugawa shogunate, which unified and ruled Japan for over 250 years.",
         "global_impact": 70, "longevity": 75, "cross_region_impact": 45},
        {"name": "Oda Nobunaga", "era_start": 1534, "era_end": 1582,
         "description": "Warlord whose campaigns began the unification of feudal Japan.",
         "global_impact": 65, "longevity": 68, "cross_region_impact": 40},
        {"name": "Emperor Meiji", "era_start": 1852, "era_end": 1912,
         "description": "Emperor during Japan's rapid modernization and industrialization.",
         "global_impact": 75, "longevity": 60, "cross_region_impact": 65},
        {"name": "Murasaki Shikibu", "era_start": 973, "era_end": 1014,
         "description": "Author of 'The Tale of Genji', often considered the world's first novel.",
         "global_impact": 60, "longevity": 78, "cross_region_impact": 50},
    ],
    "Mongolia": [
        {"name": "Genghis Khan", "era_start": 1162, "era_end": 1227,
         "description": "Founder of the Mongol Empire, the largest contiguous land empire in history.",
         "global_impact": 92, "longevity": 85, "cross_region_impact": 90},
        {"name": "Kublai Khan", "era_start": 1215, "era_end": 1294,
         "description": "Grandson of Genghis Khan who founded the Yuan dynasty in China.",
         "global_impact": 78, "longevity": 70, "cross_region_impact": 75},
    ],
    "Russia": [
        {"name": "Peter the Great", "era_start": 1672, "era_end": 1725,
         "description": "Tsar who modernized Russia and expanded it into a major European power.",
         "global_impact": 80, "longevity": 70, "cross_region_impact": 68},
        {"name": "Catherine the Great", "era_start": 1729, "era_end": 1796,
         "description": "Empress whose reign expanded Russian territory and embraced Enlightenment ideas.",
         "global_impact": 75, "longevity": 68, "cross_region_impact": 60},
        {"name": "Vladimir Lenin", "era_start": 1870, "era_end": 1924,
         "description": "Revolutionary leader who founded the Soviet state.",
         "global_impact": 88, "longevity": 60, "cross_region_impact": 82},
    ],
    "Germany": [
        {"name": "Johannes Gutenberg", "era_start": 1400, "era_end": 1468,
         "description": "Inventor of the printing press, revolutionizing the spread of information.",
         "global_impact": 96, "longevity": 92, "cross_region_impact": 90},
        {"name": "Martin Luther", "era_start": 1483, "era_end": 1546,
         "description": "Theologian whose ideas sparked the Protestant Reformation.",
         "global_impact": 88, "longevity": 82, "cross_region_impact": 78},
        {"name": "Albert Einstein", "era_start": 1879, "era_end": 1955,
         "description": "Physicist whose theory of relativity transformed modern physics.",
         "global_impact": 95, "longevity": 75, "cross_region_impact": 88},
    ],
    "Turkey": [
        {"name": "Mehmed the Conqueror", "era_start": 1432, "era_end": 1481,
         "description": "Ottoman sultan who conquered Constantinople, ending the Byzantine Empire.",
         "global_impact": 80, "longevity": 70, "cross_region_impact": 72},
        {"name": "Suleiman the Magnificent", "era_start": 1494, "era_end": 1566,
         "description": "Ottoman sultan during the empire's peak of power, culture, and law.",
         "global_impact": 78, "longevity": 68, "cross_region_impact": 70},
    ],
    "Mexico": [
        {"name": "Moctezuma II", "era_start": 1466, "era_end": 1520,
         "description": "Last fully independent Aztec emperor, ruling at the time of Spanish contact.",
         "global_impact": 60, "longevity": 55, "cross_region_impact": 65},
        {"name": "Benito Juarez", "era_start": 1806, "era_end": 1872,
         "description": "President who resisted foreign intervention and reformed Mexican law.",
         "global_impact": 55, "longevity": 50, "cross_region_impact": 45},
    ],
}

INFLUENCE_LINKS = [
    ("Julius Caesar", "Augustus"),
    ("Augustus", "Napoleon Bonaparte"),
    ("Leonardo da Vinci", "Galileo Galilei"),
    ("Sun Tzu", "Mao Zedong"),
    ("Confucius", "Deng Xiaoping"),
    ("Cleopatra VII", "Julius Caesar"),
    ("Socrates", "Aristotle"),
    ("Aristotle", "Alexander the Great"),
    ("Gautama Buddha", "Ashoka the Great"),
    ("Voltaire", "Napoleon Bonaparte"),
    ("Isaac Newton", "Albert Einstein"),
    ("Johannes Gutenberg", "Martin Luther"),
    ("Genghis Khan", "Kublai Khan"),
    ("Cyrus the Great", "Alexander the Great"),
]


def run():
    with app.app_context():
        db.drop_all()
        db.create_all()

        country_objs = {}
        for c in COUNTRIES:
            country = Country(**c)
            db.session.add(country)
            country_objs[c["name"]] = country
        db.session.commit()

        person_objs = {}
        for country_name, people in PEOPLE.items():
            country = country_objs[country_name]
            for p in people:
                person = Person(country_id=country.id, **p)
                db.session.add(person)
                person_objs[p["name"]] = person
        db.session.commit()

        for influencer_name, influenced_name in INFLUENCE_LINKS:
            influencer = person_objs.get(influencer_name)
            influenced = person_objs.get(influenced_name)
            if influencer and influenced:
                influencer.influenced.append(influenced)
        db.session.commit()

        print(f"Seeded {len(country_objs)} countries and {len(person_objs)} people.")


if __name__ == "__main__":
    run()