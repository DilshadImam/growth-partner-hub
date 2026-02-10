import { motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/section-heading";

// Mock data - will be managed from admin panel
const clients = [
  {
    id: 1,
    name: "Tech Innovations Inc",
    industry: "Technology",
    bgImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80",
    colSpan: "md:col-span-2",
    rowSpan: "md:row-span-1"
  },
  {
    id: 2,
    name: "Global Marketing Co",
    industry: "Marketing",
    bgImage: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80",
    colSpan: "md:col-span-1",
    rowSpan: "md:row-span-1"
  },
  {
    id: 3,
    name: "E-Commerce Plus",
    industry: "E-commerce",
    bgImage: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80",
    colSpan: "md:col-span-1",
    rowSpan: "md:row-span-2"
  },
  {
    id: 4,
    name: "Finance Solutions",
    industry: "Finance",
    bgImage: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&q=80",
    colSpan: "md:col-span-2",
    rowSpan: "md:row-span-1"
  },
  {
    id: 5,
    name: "Health & Wellness",
    industry: "Healthcare",
    bgImage: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80",
    colSpan: "md:col-span-1",
    rowSpan: "md:row-span-1"
  },
  {
    id: 6,
    name: "Education Hub",
    industry: "Education",
    bgImage: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80",
    colSpan: "md:col-span-1",
    rowSpan: "md:row-span-1"
  }
];

export function LatestClients() {
  return (
    <section className="py-20 lg:py-32 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex justify-center mb-4">
            <SectionHeading className="text-4xl md:text-6xl">
              Domain Of Services
            </SectionHeading>
          </div>
          <p className="text-lg text-gray-600 mt-8 max-w-2xl mx-auto">
            Trusted by leading companies across various industries
          </p>
        </motion.div>

        {/* Bento Grid - True bento style with varied sizes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto auto-rows-[200px]">
          
          {clients.map((client, index) => (
            <motion.div
              key={client.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`
                ${client.colSpan} ${client.rowSpan}
                relative rounded-2xl overflow-hidden group cursor-pointer
              `}
            >
              {/* Background Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url(${client.bgImage})` }}
              />
              
              {/* Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
              
              {/* Content */}
              <div className="relative h-full flex flex-col justify-end p-6 md:p-8">
                <p className="text-white/70 text-xs md:text-sm font-medium mb-2 uppercase tracking-wider">
                  {client.industry}
                </p>
                <h3 className="text-white text-xl md:text-2xl lg:text-3xl font-bold leading-tight">
                  {client.name}
                </h3>
              </div>
            </motion.div>
          ))}

        </div>

      </div>
    </section>
  );
}
