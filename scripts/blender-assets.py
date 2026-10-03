import bpy, math, json, os, random
from mathutils import Vector
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
out = os.path.join(root, 'public', 'models')
os.makedirs(out, exist_ok=True)
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)
# Bake the measured equatorial/polar radius ratio into the mesh itself.
bpy.ops.mesh.primitive_uv_sphere_add(segments=128, ring_count=96)
planet = bpy.context.object
planet.name = 'Saturn_Oblate'
for v in planet.data.vertices:
    v.co.x *= 60268/58232
    v.co.y *= 60268/58232
    v.co.z *= 54364/58232
for p in planet.data.polygons: p.use_smooth = True
mat=bpy.data.materials.new('Saturn_observation_map'); mat.use_nodes=True
tex=mat.node_tree.nodes.new('ShaderNodeTexImage')
tex.image=bpy.data.images.load(os.path.join(root,'public','textures','2k_saturn.jpg'))
mat.node_tree.links.new(tex.outputs['Color'],mat.node_tree.nodes.get('Principled BSDF').inputs['Base Color'])
planet.data.materials.append(mat)
bpy.ops.export_scene.gltf(filepath=os.path.join(out,'saturn.glb'),export_format='GLB',use_selection=True)
# An editable catalogue scene: vertices are real HYG J2000 positions in parsecs.
data=json.load(open(os.path.join(root,'public','data','stars.json'),encoding='utf-8'))
verts=[]
for s in data['stars']:
    a=s[3]*math.pi/12; d=s[4]*math.pi/180; r=s[5]
    verts.append((r*math.cos(d)*math.cos(a),r*math.cos(d)*math.sin(a),r*math.sin(d)))
mesh=bpy.data.meshes.new('HYG_J2000_parsecs'); mesh.from_pydata(verts,[],[]); mesh.update()
stars=bpy.data.objects.new('61450_real_catalogue_stars',mesh); bpy.context.collection.objects.link(stars)
stars['source']='HYG v4.1; David Nash; CC BY-SA 4.0'
stars['units']='parsecs; equatorial J2000; no invented stars'
planet.hide_set(True)
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(out,'atlas-catalogue.blend'))
print('ATLAS_BLENDER_ASSETS_COMPLETE')
