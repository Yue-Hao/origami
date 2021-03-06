// namespace
var Origami = Origami || {};

Origami.StreamReader = function(lines) {
    var self = this;
    this.lines = lines;
    this.count = 0;
}

Origami.StreamReader.prototype.eof = function() {    
    return this.count == this.lines.length;
};

Origami.StreamReader.prototype.readline = function() {        
    if(this.eof()) return null;
    return this.lines[this.count++];        
};

Origami.StreamReader.prototype.readlineItem = function(parseFun) {
    return parseFun(this.readline());
};


Origami.StreamReader.prototype.readlineArray = function(parseFun, d) {
    d = d || ' ';

    var items = this.readline().split(d);

    if(parseFun)
        for(var i=0;i<items.length;++i)
            items[i] = parseFun(items[i]);
    return items;
};

// read n lines
Origami.StreamReader.prototype.readArray = function(n, parseFun) {
    var items = [];

    for(var i=0;i<n;++i) {
        var item = this.readline();
        if (parseFun) item = parseFun(item)
        items.push(item)
    }

    return items;
}

Origami.StreamReader.prototype.readlineInt = function() {
    return this.readlineItem(parseInt);
};

Origami.StreamReader.prototype.readlineFloat = function(d) {
    return this.readlineItem(parseFloat)
};

Origami.StreamReader.prototype.readlineIntArray = function(d) {
    return this.readlineArray(parseInt);
};

Origami.StreamReader.prototype.readlineFloatArray = function(d) {
    return this.readlineArray(parseFloat);
};

Origami.StreamReader.prototype.readIntArray = function(n) {
    return this.readArray(n, parseInt);
};

Origami.StreamReader.prototype.readFloatArray = function(n) {
    return this.readArray(n, parseFloat);
};


