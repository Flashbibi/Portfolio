'use client'

import { Suspense, useRef, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, OrbitControls, Environment, Center } from '@react-three/drei'
import { Box3, Vector3, type Group } from 'three'
import styles from './ModelViewer.module.css'

function Model({ path }: { path: string }) {
  const { scene } = useGLTF(path)
  const ref = useRef<Group>(null)

  useEffect(() => {
    if (!ref.current) return
    const box = new Box3().setFromObject(ref.current)
    const size = new Vector3()
    box.getSize(size)
    const maxDim = Math.max(size.x, size.y, size.z)
    if (maxDim > 0) ref.current.scale.setScalar(2.5 / maxDim)
  }, [scene])

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.3
  })

  return (
    <Center>
      <primitive ref={ref} object={scene} />
    </Center>
  )
}

function Loader() {
  return (
    <mesh>
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshStandardMaterial color="#6aabdf" wireframe />
    </mesh>
  )
}

export default function ModelViewer({ model }: { model: string }) {
  return (
    <div className={styles.wrap}>
      <Canvas
        camera={{ position: [0, 1.5, 6], fov: 45 }}
        gl={{ antialias: true }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 8, 5]} intensity={1.2} />
        <directionalLight position={[-5, 2, -3]} intensity={0.3} color="#6aabdf" />

        <Suspense fallback={<Loader />}>
          <Model path={`/models/${model}`} />
          <Environment preset="city" />
        </Suspense>

        <OrbitControls
          enableZoom={true}
          enablePan={false}
          minDistance={1.5}
          maxDistance={10}
          minPolarAngle={Math.PI * 0.1}
          maxPolarAngle={Math.PI * 0.85}
        />
      </Canvas>
      <p className={styles.hint}>drag to rotate · scroll to zoom</p>
    </div>
  )
}
