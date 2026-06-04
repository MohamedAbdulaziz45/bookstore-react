interface TimelineStep {
  label: string;
  detail: string;
  active: boolean;
}

interface OrderTimelineProps {
  steps?: TimelineStep[];
}

export default function OrderTimeline({ steps = [] }: OrderTimelineProps) {
  return (
    <>
      <style>{`
        .timeline-card {
          background: #fff;
          border-radius: 22px;
          padding: 1.5rem;
          border: 1px solid rgba(199, 139, 81, 0.12);
          box-shadow: 0 14px 35px rgba(34, 25, 15, 0.06);
        }
        .timeline-eyebrow {
          text-transform: uppercase;
          font-size: 0.74rem;
          letter-spacing: 0.15em;
          color: #8f623a;
          margin-bottom: 1rem;
        }
        .timeline-step-row {
          display: grid;
          grid-template-columns: 22px 1fr;
          gap: 0.9rem;
          padding: 0.75rem 0;
        }
        .timeline-marker {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #e6d5bf;
          margin-top: 0.45rem;
          box-shadow: 0 0 0 6px rgba(199, 139, 81, 0.12);
        }
        .timeline-marker.active {
          background: #c78b51;
        }
        .timeline-step-title {
          margin: 0 0 0.25rem;
          color: var(--brand-dark);
        }
        .timeline-step-detail {
          margin: 0;
          color: var(--brand-gray);
        }
      `}</style>

      <div className="timeline-card">
        <p className="timeline-eyebrow">Tracking Timeline</p>

        {steps.map((step) => (
          <div className="timeline-step-row" key={step.label}>
            <div className={`timeline-marker${step.active ? " active" : ""}`} />
            <div>
              <h4 className="timeline-step-title">{step.label}</h4>
              <p className="timeline-step-detail">{step.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
