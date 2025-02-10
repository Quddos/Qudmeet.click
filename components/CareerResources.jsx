export default function CareerResources() {
  const resources = [
    {
      title: "Resume Writing Guide",
      description: "Learn how to create an ATS-friendly resume that stands out",
      icon: "📝",
      link: "/tools/resume-analyzer"
    },
    {
      title: "Interview Preparation",
      description: "Top interview questions and expert answers",
      icon: "🎯",
      link: "/dashboard"
    },
    {
      title: "Career Development",
      description: "Tips for career growth and professional development",
      icon: "📈",
      link: "/opportunities/job-board"
    }
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8">Career Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {resources.map((resource, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl mb-4">{resource.icon}</div>
              <h3 className="font-semibold text-xl mb-2">{resource.title}</h3>
              <p className="text-gray-600 mb-4">{resource.description}</p>
              <a href={resource.link} className="text-blue-600 hover:underline">
                Read More →
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 