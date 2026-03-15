// Generate low-poly veterinary 3D models as .glb files
// Uses @gltf-transform/core (Node.js compatible, no browser APIs needed)
// Run: node scripts/generate-models.mjs

import { Document, NodeIO } from '@gltf-transform/core'
import { writeFileSync } from 'fs'

async function createAndExport(name, buildFn) {
  const doc = new Document()
  const scene = doc.createScene(name)
  const buffer = doc.createBuffer()

  buildFn(doc, scene, buffer)

  const io = new NodeIO()
  const glb = await io.writeBinary(doc)
  writeFileSync(`public/models/${name}.glb`, Buffer.from(glb))
  console.log(`  ✓ ${name}.glb (${(glb.byteLength / 1024).toFixed(1)} KB)`)
}

// Helper: create a sphere mesh
function addSphere(doc, scene, buffer, { radius = 0.3, widthSeg = 16, heightSeg = 12, position = [0,0,0], scale = [1,1,1] } = {}) {
  const positions = []
  const normals = []
  const indices = []

  for (let y = 0; y <= heightSeg; y++) {
    const v = y / heightSeg
    const phi = v * Math.PI
    for (let x = 0; x <= widthSeg; x++) {
      const u = x / widthSeg
      const theta = u * Math.PI * 2
      const px = -radius * Math.cos(theta) * Math.sin(phi)
      const py = radius * Math.cos(phi)
      const pz = radius * Math.sin(theta) * Math.sin(phi)
      positions.push(px * scale[0], py * scale[1], pz * scale[2])
      const len = Math.sqrt(px*px + py*py + pz*pz) || 1
      normals.push(px/len, py/len, pz/len)
    }
  }

  for (let y = 0; y < heightSeg; y++) {
    for (let x = 0; x < widthSeg; x++) {
      const a = y * (widthSeg + 1) + x
      const b = a + widthSeg + 1
      indices.push(a, b, a + 1, b, b + 1, a + 1)
    }
  }

  const posAccessor = doc.createAccessor().setType('VEC3').setArray(new Float32Array(positions)).setBuffer(buffer)
  const normAccessor = doc.createAccessor().setType('VEC3').setArray(new Float32Array(normals)).setBuffer(buffer)
  const idxAccessor = doc.createAccessor().setType('SCALAR').setArray(new Uint16Array(indices)).setBuffer(buffer)

  const material = doc.createMaterial().setBaseColorFactor([0.482, 0.369, 0.655, 1]).setRoughnessFactor(0.4).setMetallicFactor(0.1)
  const prim = doc.createPrimitive().setAttribute('POSITION', posAccessor).setAttribute('NORMAL', normAccessor).setIndices(idxAccessor).setMaterial(material)
  const mesh = doc.createMesh().addPrimitive(prim)
  const node = doc.createNode().setMesh(mesh).setTranslation(position)
  scene.addChild(node)
  return node
}

// Helper: create a cylinder mesh
function addCylinder(doc, scene, buffer, { radiusTop = 0.1, radiusBot = 0.1, height = 1, segments = 12, position = [0,0,0] } = {}) {
  const positions = []
  const normals = []
  const indices = []
  const halfH = height / 2

  // Side vertices
  for (let i = 0; i <= segments; i++) {
    const theta = (i / segments) * Math.PI * 2
    const cos = Math.cos(theta)
    const sin = Math.sin(theta)
    // Top
    positions.push(radiusTop * cos, halfH, radiusTop * sin)
    normals.push(cos, 0, sin)
    // Bottom
    positions.push(radiusBot * cos, -halfH, radiusBot * sin)
    normals.push(cos, 0, sin)
  }

  for (let i = 0; i < segments; i++) {
    const a = i * 2, b = a + 1, c = a + 2, d = a + 3
    indices.push(a, b, c, b, d, c)
  }

  // Caps
  const topCenter = positions.length / 3
  positions.push(0, halfH, 0)
  normals.push(0, 1, 0)
  for (let i = 0; i <= segments; i++) {
    const theta = (i / segments) * Math.PI * 2
    positions.push(radiusTop * Math.cos(theta), halfH, radiusTop * Math.sin(theta))
    normals.push(0, 1, 0)
  }
  for (let i = 0; i < segments; i++) {
    indices.push(topCenter, topCenter + 1 + i, topCenter + 2 + i)
  }

  const botCenter = positions.length / 3
  positions.push(0, -halfH, 0)
  normals.push(0, -1, 0)
  for (let i = 0; i <= segments; i++) {
    const theta = (i / segments) * Math.PI * 2
    positions.push(radiusBot * Math.cos(theta), -halfH, radiusBot * Math.sin(theta))
    normals.push(0, -1, 0)
  }
  for (let i = 0; i < segments; i++) {
    indices.push(botCenter, botCenter + 2 + i, botCenter + 1 + i)
  }

  const posA = doc.createAccessor().setType('VEC3').setArray(new Float32Array(positions)).setBuffer(buffer)
  const normA = doc.createAccessor().setType('VEC3').setArray(new Float32Array(normals)).setBuffer(buffer)
  const idxA = doc.createAccessor().setType('SCALAR').setArray(new Uint16Array(indices)).setBuffer(buffer)

  const material = doc.createMaterial().setBaseColorFactor([0.482, 0.369, 0.655, 1]).setRoughnessFactor(0.4).setMetallicFactor(0.1)
  const prim = doc.createPrimitive().setAttribute('POSITION', posA).setAttribute('NORMAL', normA).setIndices(idxA).setMaterial(material)
  const mesh = doc.createMesh().addPrimitive(prim)
  const node = doc.createNode().setMesh(mesh).setTranslation(position)
  scene.addChild(node)
  return node
}

// ====== MODEL BUILDERS ======

function buildPaw(doc, scene, buffer) {
  // Main pad
  addSphere(doc, scene, buffer, { radius: 0.45, position: [0, -0.15, 0], scale: [1, 0.6, 1.1] })
  // 4 toe pads
  const toes = [[-0.35, 0.25, 0.1], [-0.12, 0.4, 0.1], [0.12, 0.4, 0.1], [0.35, 0.25, 0.1]]
  for (const pos of toes) {
    addSphere(doc, scene, buffer, { radius: 0.18, widthSeg: 12, heightSeg: 8, position: pos, scale: [1, 0.7, 1] })
  }
}

function buildBone(doc, scene, buffer) {
  // Shaft
  addCylinder(doc, scene, buffer, { radiusTop: 0.12, radiusBot: 0.12, height: 0.9, position: [0, 0, 0] })
  // End knobs
  const knobs = [[-0.5, 0.12, 0], [-0.5, -0.12, 0], [0.5, 0.12, 0], [0.5, -0.12, 0]]
  for (const pos of knobs) {
    addSphere(doc, scene, buffer, { radius: 0.16, widthSeg: 12, heightSeg: 8, position: pos })
  }
}

function buildHeart(doc, scene, buffer) {
  // Simplified heart: two overlapping spheres + cone bottom
  addSphere(doc, scene, buffer, { radius: 0.3, position: [-0.18, 0.15, 0] })
  addSphere(doc, scene, buffer, { radius: 0.3, position: [0.18, 0.15, 0] })
  // Bottom point (cone-like via scaled sphere)
  addSphere(doc, scene, buffer, { radius: 0.25, position: [0, -0.15, 0], scale: [0.8, 1.2, 0.8] })
}

function buildSyringe(doc, scene, buffer) {
  // Barrel
  addCylinder(doc, scene, buffer, { radiusTop: 0.12, radiusBot: 0.12, height: 0.8, segments: 16, position: [0, 0, 0] })
  // Flange
  addCylinder(doc, scene, buffer, { radiusTop: 0.2, radiusBot: 0.2, height: 0.03, segments: 16, position: [0, -0.4, 0] })
  // Plunger
  addCylinder(doc, scene, buffer, { radiusTop: 0.15, radiusBot: 0.15, height: 0.03, segments: 16, position: [0, -0.55, 0] })
  // Needle
  addCylinder(doc, scene, buffer, { radiusTop: 0.01, radiusBot: 0.03, height: 0.3, segments: 8, position: [0, 0.55, 0] })
  // Needle base
  addCylinder(doc, scene, buffer, { radiusTop: 0.06, radiusBot: 0.04, height: 0.08, segments: 12, position: [0, 0.42, 0] })
}

function buildTrophy(doc, scene, buffer) {
  // Cup body (stack of cylinders for lathe-like shape)
  addCylinder(doc, scene, buffer, { radiusTop: 0.35, radiusBot: 0.3, height: 0.15, position: [0, 0.1, 0] })
  addCylinder(doc, scene, buffer, { radiusTop: 0.3, radiusBot: 0.35, height: 0.2, position: [0, 0.28, 0] })
  addCylinder(doc, scene, buffer, { radiusTop: 0.08, radiusBot: 0.25, height: 0.15, position: [0, 0.45, 0] })
  // Rim
  addCylinder(doc, scene, buffer, { radiusTop: 0.37, radiusBot: 0.35, height: 0.04, position: [0, 0.02, 0] })
  // Base
  addCylinder(doc, scene, buffer, { radiusTop: 0.25, radiusBot: 0.3, height: 0.08, position: [0, -0.2, 0] })
  // Pedestal
  addCylinder(doc, scene, buffer, { radiusTop: 0.08, radiusBot: 0.08, height: 0.15, position: [0, -0.1, 0] })
  // Handles (spheres as approximation)
  addSphere(doc, scene, buffer, { radius: 0.08, position: [-0.42, 0.25, 0] })
  addSphere(doc, scene, buffer, { radius: 0.08, position: [0.42, 0.25, 0] })
}

function buildStethoscope(doc, scene, buffer) {
  // Chest piece
  addCylinder(doc, scene, buffer, { radiusTop: 0.2, radiusBot: 0.18, height: 0.06, segments: 16, position: [0, -0.5, 0] })
  // Tube (approximated with cylinders)
  addCylinder(doc, scene, buffer, { radiusTop: 0.035, radiusBot: 0.035, height: 0.5, position: [0, -0.2, 0] })
  // Y-split tubes
  addCylinder(doc, scene, buffer, { radiusTop: 0.03, radiusBot: 0.03, height: 0.3, position: [-0.15, 0.15, 0] })
  addCylinder(doc, scene, buffer, { radiusTop: 0.03, radiusBot: 0.03, height: 0.3, position: [0.15, 0.15, 0] })
  // Earpieces
  addSphere(doc, scene, buffer, { radius: 0.06, widthSeg: 10, heightSeg: 8, position: [-0.25, 0.35, 0] })
  addSphere(doc, scene, buffer, { radius: 0.06, widthSeg: 10, heightSeg: 8, position: [0.25, 0.35, 0] })
}

function buildBrain(doc, scene, buffer) {
  // Left hemisphere
  addSphere(doc, scene, buffer, { radius: 0.38, position: [-0.18, 0, 0], scale: [0.9, 0.8, 1] })
  // Right hemisphere
  addSphere(doc, scene, buffer, { radius: 0.38, position: [0.18, 0, 0], scale: [0.9, 0.8, 1] })
  // Cerebellum
  addSphere(doc, scene, buffer, { radius: 0.2, widthSeg: 12, heightSeg: 8, position: [0, -0.2, -0.2] })
  // Brain stem
  addCylinder(doc, scene, buffer, { radiusTop: 0.08, radiusBot: 0.06, height: 0.2, position: [0, -0.4, -0.1] })
  // Surface folds
  const folds = [[0.15, 0.2, 0.25], [-0.15, 0.25, 0.2], [0.25, 0.05, 0.2], [-0.25, 0.1, 0.18]]
  for (const pos of folds) {
    addSphere(doc, scene, buffer, { radius: 0.1, widthSeg: 8, heightSeg: 6, position: pos })
  }
}

// ====== MAIN ======

async function main() {
  console.log('Generating 3D models...\n')

  const models = [
    { name: 'paw', build: buildPaw },
    { name: 'bone', build: buildBone },
    { name: 'heart', build: buildHeart },
    { name: 'syringe', build: buildSyringe },
    { name: 'trophy', build: buildTrophy },
    { name: 'stethoscope', build: buildStethoscope },
    { name: 'brain', build: buildBrain },
  ]

  for (const { name, build } of models) {
    await createAndExport(name, build)
  }

  console.log('\nDone! All models saved to public/models/')
}

main().catch(console.error)
