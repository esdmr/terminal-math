cd build
for i in **.js
	mkdir -p min/(dirname $i)
	pnpx uglifyjs -cm -o min/(dirname $i)/(basename $i .js).js --ecma 8 --rename --source-map --toplevel --warn $i
end
