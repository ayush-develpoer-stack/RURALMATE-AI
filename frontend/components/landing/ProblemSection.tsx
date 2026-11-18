import { FiHelpCircle, FiTrendingDown, FiFileText, FiArrowRight } from 'react-icons/fi';
import './ProblemSection.css';

const PROBLEMS = [
  {
    icon: <FiHelpCircle />,
    title: 'Unreliable business information',
    desc: 'Decisions are made on hearsay, not on local demand, competition or capital fit.',
  },
  {
    icon: <FiTrendingDown />,
    title: 'Finance is hard to understand',
    desc: 'Project cost, funding gap, EMI and break-even are confusing and rarely structured.',
  },
  {
    icon: <FiFileText />,
    title: 'Schemes are hard to navigate',
    desc: 'Relevant government support exists, but is buried in complex eligibility and paperwork.',
  },
];

export default function ProblemSection() {
  return (
    <section className="problem" id="about">
      <div className="container">
        <div className="problem__head">
          <h2 className="problem__title">
            Rural business decisions shouldn&apos;t be based on guesswork.
          </h2>
        </div>
        <div className="problem__grid">
          {PROBLEMS.map((p) => (
            <div key={p.title} className="problem__card">
              <span className="problem__icon">{p.icon}</span>
              <h3>{p.title}</h3>
              <p>{p.desc}</p>
            </div>
          ))}
        </div>
        <div className="problem__transition">
          <span>
            RuralMate AI brings these decisions into one intelligent platform.
          </span>
          <FiArrowRight />
        </div>
      </div>
    </section>
  );
}
