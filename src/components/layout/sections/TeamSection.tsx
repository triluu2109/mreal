import { Phone } from "lucide-react";
import { getI18n } from "@/lib/i18n/server";

type StaffMember = {
  id: string;
  name: string;
  role: string;
  phone: string;
  initials: string;
  image: string | null;
  color: string;
  speciality: string | null;
};

interface Props {
  staff: StaffMember[];
}

export default async function TeamSection({ staff }: Props) {
  const { dict: vi } = await getI18n();

  return (
    <section className="section-padding bg-white" id="team">
      <div className="container-site">
        <div className="text-center mb-14">
          <span className="section-label">{vi.about_page.team.section_label}</span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-navy mt-3 mb-4">
            {vi.about_page.team.heading}{" "}
            <span className="text-gradient-gold">{vi.about_page.team.heading_highlight}</span>
          </h2>
          <p className="text-gray-text max-w-2xl mx-auto text-lg">
            {vi.about_page.team.summary}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {staff.map((member) => (
            <div
              key={member.id}
              className="bg-white rounded-2xl overflow-hidden border border-gray-border hover:border-gold/30 hover:shadow-lg transition-all duration-200 group text-center"
            >
              {/* Avatar */}
              <div className={`bg-gradient-to-br ${member.color} h-40 flex items-center justify-center relative overflow-hidden`}>
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage: `radial-gradient(circle at 30% 50%, rgba(255,255,255,0.3) 0%, transparent 50%)`,
                  }}
                />
                <div className="w-24 h-24 rounded-full bg-white/20 border-4 border-white/40 flex items-center justify-center">
                  <span className="font-heading font-extrabold text-2xl text-white">
                    {member.initials}
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="p-6">
                <h3 className="font-heading font-bold text-navy text-lg mb-1 group-hover:text-gold transition-colors">
                  {member.name}
                </h3>
                <p className="text-gray-text text-sm mb-2">{member.role}</p>
                {member.speciality && (
                  <span className="inline-block bg-gold/10 text-gold-dark text-xs px-3 py-1 rounded-full mb-4">
                    {member.speciality}
                  </span>
                )}
                <a
                  href={`tel:${member.phone.replace(/\s/g, "")}`}
                  className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-gold text-white text-sm font-medium font-heading hover:bg-gold-dark transition-colors"
                >
                  <Phone size={15} />
                  {member.phone}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
