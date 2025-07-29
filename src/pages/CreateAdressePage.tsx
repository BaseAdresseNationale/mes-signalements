import React, { useEffect } from 'react'
import CreateAdresseStepper from '../composants/adresse/CreateAdresseStepper'

export function CreateAdressePage() {
  useEffect(() => {
    const createAdresseButton = document.getElementById('create-adresse-button')
    if (createAdresseButton) {
      createAdresseButton.classList.add('active')
    }

    return () => {
      if (createAdresseButton) {
        createAdresseButton.classList.remove('active')
      }
    }
  }, [])

  return <CreateAdresseStepper />
}
