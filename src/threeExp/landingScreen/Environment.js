import * as THREE from 'three'

export default class Environment {
   constructor(experience) {
      this.scene = experience.scene
      this.resources = experience.resources
      this.debug = experience.debug

      // Debug
      if (this.debug.active) {
         this.debugFolder = this.debug.gui.addFolder('environment')
      }

      this.setLight()
   }

   setLight() {
      this.sunLight = new THREE.DirectionalLight('#ffffff', 4)
      this.sunLight.castShadow = true
      this.sunLight.shadow.camera.far = 15
      this.sunLight.shadow.mapSize.set(1024, 1024)
      this.sunLight.shadow.normalBias = 0.05
      this.sunLight.position.set(3.5, 2, - 1.25)
      this.scene.add(this.sunLight)

      // Debug
      if (this.debug.active) {
         this.debugFolder
         .add(this.sunLight, 'intensity', 0, 10, 0.001)
         .name('sunLightIntensity')

         this.debugFolder
         .add(this.sunLight.position, 'x', -5, 5, 0.001)
         .name('sunLightX')

         this.debugFolder
         .add(this.sunLight.position, 'y', -5, 5, 0.001)
         .name('sunLightY')

         this.debugFolder
         .add(this.sunLight.position, 'z', -5, 5, 0.001)
         .name('sunLightZ')
      }
   }

}