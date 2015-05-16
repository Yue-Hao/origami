// set this matrix to a transform matrix that
// rotatie around a line segment for theta radian
// p1 : THREE.Vector3, start
// p2 : THREE.Vector3, end
// theta : rotation angle in radian
THREE.Matrix4.prototype.makeTransform = function(p1, p2, theta) {    
    var a = p1.x;
    var b = p1.y;
    var c = p1.z;

    var p = new THREE.Vector3();
    p.subVectors(p2, p1);
    p = p.normalize();

    var u = p.x;
    var v = p.y;
    var w = p.z;

    var uu = u * u;
    var uv = u * v;
    var uw = u * w;
    var vv = v * v;
    var vw = v * w;
    var ww = w * w;
    var au = a * u;
    var av = a * v;
    var aw = a * w;
    var bu = b * u;
    var bv = b * v;
    var bw = b * w;
    var cu = c * u;
    var cv = c * v;
    var cw = c * w;

    var costheta = Math.cos(theta);
    var sintheta = Math.sin(theta);

    var n11 = uu + (vv + ww) * costheta;
    var n21 = uv * (1 - costheta) + w * sintheta;
    var n31 = uw * (1 - costheta) - v * sintheta;
    var n41 = 0;

    var n12 = uv * (1 - costheta) - w * sintheta;
    var n22 = vv + (uu + ww) * costheta;
    var n32 = vw * (1 - costheta) + u * sintheta;
    var n42 = 0;

    var n13 = uw * (1 - costheta) + v * sintheta;
    var n23 = vw * (1 - costheta) - u * sintheta;
    var n33 = ww + (uu + vv) * costheta;
    var n43 = 0;

    var n14 = (a * (vv + ww) - u * (bv + cw)) * (1 - costheta) + (bw - cv) * sintheta;
    var n24 = (b * (uu + ww) - v * (au + cw)) * (1 - costheta) + (cu - aw) * sintheta;
    var n34 = (c * (uu + vv) - w * (au + bv)) * (1 - costheta) + (av - bu) * sintheta;
    var n44 = 1;

    this.set ( n11, n12, n13, n14, n21, n22, n23, n24, n31, n32, n33, n34, n41, n42, n43, n44 );

    return this;
}

// compute the area of the face
THREE.Face3.prototype.area = function(g) {
    var e1 = g.vertices[this.b].clone().sub(g.vertices[this.a]).length();
    var e2 = g.vertices[this.c].clone().sub(g.vertices[this.b]).length();
    var e3 = g.vertices[this.a].clone().sub(g.vertices[this.c]).length();

    var s = (e1+e2+e3)/2;
    var area = Math.sqrt(s*(s-e1)*(s-e2)*(s-e3));

    return area;
}

// normalize the geometry to center at 0,0,0 and has unit sphere
THREE.Geometry.prototype.normalize = function() {
    this.computeBoundingSphere();

    var COM = this.boundingSphere.center;
    var R = this.boundingSphere.radius;

    console.log('COM = ({0},{1},{2}) R = {3}'.format(COM.x, COM.y, COM.z, R));

    var s = (R === 0 ? 1 : 1.0 / R);

    var m = new THREE.Matrix4().set(
        s, 0, 0, -s * COM.x,
        0, s, 0, -s * COM.y,
        0, 0, s, -s * COM.z,
        0, 0, 0, 1 );

    this.applyMatrix( m );


    COM = this.boundingSphere.center;
    R = this.boundingSphere.radius;

    console.log('COM = ({0},{1},{2}) R = {3}'.format(COM.x, COM.y, COM.z, R));


    return this;
}

// set the current array a linear blend of a->b by given percentage
// a and b should have the same length
Array.prototype.linearBlend = function(a, b, percentage) {
    // clear myself
    this.splice(0, this.length);

    for(var i=0;i<a.length;++i)    
        this[i] = a[i] * (1 - percentage) + b[i] * percentage;
    
    return this;
}

// sallow clone of a array
Array.prototype.clone = function() {
    return this.slice(0);
};

Array.prototype.count = function(condition) {    
    return this.reduce(function(total,x){
        return condition(x) ? total+1 : total}
    , 0);
}

// First, checks if it isn't implemented yet.
if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) { 
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
      ;
    });
  };
}

String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

// get query string
function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

// generate an array start, start + 1, ... start + count - 1
function range(start, count) {
    if(arguments.length == 1) {
        count = start;
        start = 0;
    }

    var foo = [];
    for (var i = 0; i < count; i++) {
        foo.push(start + i);
    }
    return foo;
}