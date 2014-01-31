import json
import sys

f = open(sys.argv[1], "r")
s = f.read()
arr = json.loads(s)

fw = open(sys.argv[2], "w")
for a in arr:
	fw.write(json.dumps(a)+"\n")
fw.close()	
