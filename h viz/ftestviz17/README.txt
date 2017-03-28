
I needed to have all of these files in this in the node.js installation folder, so that all the dependencies could be found, but you might have a different setup. I also needed to add something to my Windows path, but I forgot what it was and it may not be an issue for you.


-ftest_node.js is the node.js server script (that should be merged with your server)

In the public folder:

-b4w.min.js is the Blend4Web engine

-ftest_b4w.js is the code that controls the visualization

-fteststyle.css is, yes, the style sheet for the html

-ftestviz.json is the 3d-model exported by Blender
-ftest_b4w.bin may be related to that, at least it is created by Blender

-index.html is that exactly

-jquery-1.11.1.min.js is not neccessarily needed for our application? I'm not sure, so I left it.

-The uranium files are needed by Blend4Web.

In the blend folder:
-ftestviz.blend is the original Blender model (that is totally Work In Progress!!! I'll make it better!)
-ftestviz.blend1 is something that gets created alongside the .blend file

