import json

locations = ["obsidianfieldlands","crimsonmirelands","cobaltcoastlands","coronethighlands","alabastericelands"]
while True:
    location = locations[int(input(f"Which location? (0/1/2/3/4) ({'/'.join(locations)}): "))]
    marker_id = input("Marker ID: ")
    spawner_id = int(input("Spawner ID: "))

    with open(f"{location}.json", "r") as f:
        markers = json.load(f)
        item = markers[marker_id]
        item["spawnerID"] = spawner_id
        markers[marker_id] = item
    with open(f"{location}.json", "w") as f:
        json.dump(markers,f,indent=2)