import json
from unidecode import unidecode

# 1. Read the Original JSON File
with open('../cities.json', 'r') as original_file:
    original_data = json.load(original_file)

# 2. Modify the Data Structure
new_data = {}
for entry in original_data:
    city_name = unidecode(entry["name"])
    city_info = {
        "country": entry["country"],
        "lat": entry["lat"],
        "lng": entry["lng"]
    }
    new_data[city_name] = city_info

# 3. Write to a New JSON File
with open('new_data.json', 'w') as new_file:
    json.dump(new_data, new_file, indent=2)

print("Data has been written to new_data.json")
