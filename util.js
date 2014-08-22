$.util = {};
$.util.checkRange = function(v, ll, lu) {
  if (v < ll) return ll;
  if (v > lu) return lu;
  return v;
};
