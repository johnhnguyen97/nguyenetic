import { HeroField } from "./_components/HeroField"
import { ProofSection } from "./_components/ProofSection"
import { ServicesSection } from "./_components/ServicesSection"
import { WorkSection } from "./_components/WorkSection"
import { ContactSection } from "./_components/ContactSection"

export const metadata = {
  title: "Preview — Nguyenetic redesign",
  description: "Design preview of the 'studio in orbit' concept",
}

export default function Preview() {
  return (
    <>
      <HeroField />
      <ProofSection />
      <ServicesSection />
      <WorkSection />
      <ContactSection />
    </>
  )
}
