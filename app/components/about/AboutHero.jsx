import Image from "next/image";

const AboutHero = ({ title, subtitle }) => {
  return (
    <div className="relative h-[60vh] min-h-[400px] w-full">
      {/* Background Image */}
      <div className="absolute inset-0  bg-slate-600">
        <Image
          src="/about/about-hero.jpg"
          alt="About Natours"
          fill
          priority
          className="object-cover mix-blend-overlay opacity-80"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              {title}
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              {subtitle}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutHero;
