import * as THREE from 'three'

export default class Floor {
   constructor(experience) {
      this.scene = experience.scene
      this.resources = experience.resources

      // this.setTextures()
      this.setGeometry()
      this.setMaterial()
      this.setMesh()
   }

   setGeometry() {
      this.geometry = new THREE.PlaneGeometry(5, 5)
   }

   setMaterial() {
      this.material = new THREE.MeshBasicMaterial({
         color: 0xffffff,
      })
   }

   setMesh() {
      this.mesh = new THREE.Mesh(
         this.geometry,
         this.material,
      )
      this.mesh.rotation.x = -Math.PI * 0.5
      this.mesh.position.set(0, -1, 0)
      this.scene.add(this.mesh)
      console.log(this.scene)
   }
}