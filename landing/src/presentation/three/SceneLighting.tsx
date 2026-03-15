export function SceneLighting() {
  return (
    <>
      {/* Ambient fill */}
      <ambientLight intensity={0.4} color="#FFF8F0" />

      {/* Key light — top-right, warm */}
      <directionalLight
        position={[5, 5, 5]}
        intensity={0.8}
        color="#FFFFFF"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-bias={-0.0001}
      />

      {/* Rim/back light — opposite side for depth */}
      <directionalLight
        position={[-4, 3, -3]}
        intensity={0.3}
        color="#E8E0F0"
      />
    </>
  )
}
