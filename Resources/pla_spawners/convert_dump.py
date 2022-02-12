import json

locations = ["obsidianfieldlands","crimsonmirelands","cobaltcoastlands","coronethighlands","alabastericelands"]
prefixes = ["eve","fly","gmk","lnd","mas","oyb","swm","whl","sky"]
# TODO: update blacklist and alphas to use group ids instead of spawner ids
blacklists = [
    [],
    [],
    [2414],
    [],
    [1122,1428,1445,1530,1632,1683,1700,1734,1870,2856]
]
alphas = [
    [i*17 for i in range(18)],
    [i*17 for i in range(19)],
    [i*17 for i in range(18)],
    [i*17 for i in range(15)],
    [i*17 for i in range(13)]
]

for map_id in range(1,6):
    markers = {}
    with open(f"./dumps/Spawner_ha_area0{map_id}.txt",encoding="utf-8") as spawner_dump:
        index = 0
        for line in spawner_dump.readlines()[1:]:
            split = line.split(",")
            i = 0
            while split[i][:4] != " V3f":
                i += 1
            pos = [float(x) for x in "".join(split[i:i+3])[5:-1].split(" ")]
            flag = False
            while not flag:
                split2 = split[i].split('"')
                if len(split2) == 3:
                    flag = split2[-2][:3] in prefixes
                i += 1
            if split[i-1].split('"')[-2][:3] != "eve":
                if index*17 in blacklists[map_id-1]:
                    blacklists[map_id-1].remove(index*17)
                    print(index*17, pos)
                    continue
                alpha = index*17 in alphas[map_id-1]
                swarm = split[i-1].split('"')[-2][:3] == "mas"
                if not swarm:
                    markers[index] = {
                        "coords": pos,
                        "icon": "/pokearth/hisui/icons/alpha.png" if alpha else "/pokearth/hisui/icons/event.png" if swarm else "/pokearth/hisui/icons/pokeball.png",
                        "groupID": index,
                        "ivs": 3 if alpha else 0,
                        "name": split[i-1].split('"')[-2]
                    }
                index += 1
    json.dump(markers,open(f"./jsons/{locations[map_id-1]}.json","w+"),indent=2)
