import { forwardRef, useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import type { Group } from 'three'
import type { MaterialConfig } from './transitionConfig'

interface VetModelProps {
  modelPath: string
  material: MaterialConfig
  scale?: number
}

export const VetModel = forwardRef<Group, VetModelProps>(
  function VetModel({ modelPath, material, scale = 1 }, ref) {
    const { scene } = useGLTF(modelPath)

    const clonedScene = useMemo(() => {
      const clone = scene.clone(true)
      clone.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.material = new THREE.MeshStandardMaterial({
            color: new THREE.Color(material.color),
            roughness: material.roughness,
            metalness: material.metalness,
          })
          child.castShadow = true
          child.receiveShadow = true
        }
      })
      return clone
    }, [scene, material.color, material.roughness, material.metalness])

    return (
      <group ref={ref} scale={scale} dispose={null}>
        <primitive object={clonedScene} />
      </group>
    )
  }
)
