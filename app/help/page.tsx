import { Sidebar } from "@/components/sidebar";
import { TopHeader } from "@/components/top-header";

export default function HelpPage() {
  const faqs = [
    {
      question: "How do I create a new field?",
      answer: "Click the Map icon in the sidebar, then click 'Add Zone' and draw on the map.",
    },
    {
      question: "How do I view field details?",
      answer: "Click on any field label on the map, then click 'View Details'.",
    },
    {
      question: "Where can I see my schedule?",
      answer: "Click the Schedule icon in the sidebar to view all your irrigation tasks.",
    },
    {
      question: "How do I change my password?",
      answer: "Go to Settings and scroll to the Security section to update your password.",
    },
    {
      question: "How do I delete a field?",
      answer: "On the map, click the X button on the field in the right sidebar list.",
    },
    {
      question: "Where can I see analytics?",
      answer: "Click the Analytics icon in the sidebar to view water usage and performance data.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="ml-64">
        <TopHeader />
        
        <main className="p-8 max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Help</h1>
            <p className="text-gray-500 mt-1">Frequently asked questions</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 divide-y divide-gray-200">
            {faqs.map((faq, index) => (
              <div key={index} className="p-6">
                <h3 className="font-semibold text-lg text-gray-900 mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

