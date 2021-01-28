cd build
command rm -r min
echo

for i in **.js
	echo -n \rMinifying: $i
	mkdir -p min/(dirname $i)
	pnpx uglifyjs -cm -o min/(dirname $i)/(basename $i .js).js --ecma 8 --rename --source-map --toplevel --warn $i
end

echo
test -e unicode.json.gz
and cp unicode.json.gz min/
