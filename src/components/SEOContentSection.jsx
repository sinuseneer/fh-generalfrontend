import { useState } from "react";
import "../App.css";
import { Link } from "react-router-dom";

const SEOContentSection = () => {
  const [expanded, setExpanded] = useState(false);

  const toggleContent = () => setExpanded(!expanded);

  return (
    <section className="seo-content-section" style={{ padding: "40px 0" }}>
      <div className="container">
        {/* 👆 Add container wrapper */}

        <p>
          FH General Equipment is a Growth-focused supplier of medical
          equipment, industrial equipment, and general{" "}
          <Link to="/blog/69200a65S9c54eb9d505f6c39" className="seo-link">
            equipment in Guyana
          </Link>{" "}
          and the USA. As a new Trusted emerging provider bringing new value to
          the market, we provide <Link to="/blog/69204654f555219d182919e0" className="seo-link">high-quality</Link>, reliable, and affordable
          equipment solutions for hospitals, clinics, laboratories, factories,
          and businesses. Our mission is to offer <Link to="/products" className="seo-link">products </Link>that meet
          international standards, reliable service, and effective support to
          help organizations operate safely and efficiently. Whether you need
          diagnostic equipment, surgical instruments,<Link to="/blog/692045caf555219d182919d9" className="seo-link"> safety tools</Link>, or
          industrial supplies, FH General Equipment is dedicated to being your
          trusted partner for durable, high-performance equipment that boosts
          quality and productivity.
        </p>

        {expanded && (
          <>
            <p>
              As a leading equipment supplier in Guyana, we focus on providing
              healthcare facilities and industries with the tools they need to
              grow and function effectively. Our range of <Link to="/blog/6920096e9c54eb9d505f6c1a" className="seo-link">medical equipment</Link>
              includes patient monitors, operating lights, sterilizers, lab
              analyzers, and essential <Link to="/product/69181f65d64c3d9be585c038" className="seo-link">hospital supplies</Link>. We also offer
              industrial equipment such as safety gear, power tools, electrical
              components, and machinery designed to support manufacturing,
              construction, and engineering sectors. Every <Link to="/products" className="seo-link">product</Link> is carefully
              sourced from reputable manufacturers to ensure long-lasting
              performance and compliance with international safety standards.
            </p>

            <p>
              FH General Equipment understands the increasing demand for
              dependable equipment across Guyana and the USA. That’s why we
              prioritize fast delivery, professional support, and clear guidance
              to help organizations make informed purchasing decisions. Our team
              provides product consultation, technical information, and ongoing
              <Link to="/contact" className="seo-link">customer assistance</Link>, ensuring every client receives the right
              equipment for their specific needs. We are committed to building
              long-term partnerships based on trust, transparency, and
              exceptional service.
            </p>

            <p>
              By continuously expanding our product portfolio,<Link to="/" className="seo-link"> FH General
              Equipment</Link> aims to become the preferred supplier of medical,
              industrial, and general equipment in Guyana. Our focus on quality,
              affordability, and customer satisfaction allows us to support
              hospitals, clinics, laboratories, factories, and businesses with
              equipment solutions that improve productivity, safety, and overall
              performance.
            </p>
          </>
        )}

        <span
          onClick={toggleContent}
          style={{ color: "#007bff", cursor: "pointer", fontWeight: "500" }}
        >
          {expanded ? "Read Less" : "Read More"}
        </span>
      </div>
    </section>
  );
};

export default SEOContentSection;
