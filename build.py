import os

for r, d, files in os.walk('.'):
    for f in files:
        p = os.path.splitext(f)
        if p[1] == '.js':
            cmd = "minify %s.js > %s.min.js" % (p[0], p[0])
            print "Minifing %s" % f
            os.system(cmd)
