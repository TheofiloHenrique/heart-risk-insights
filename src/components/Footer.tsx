const Footer = () => (
  <footer className="bg-foreground py-10">
    <div className="container mx-auto px-4 text-center">
      <div className="flex items-center justify-center gap-2 mb-4">
        <svg viewBox="0 0 24 24" className="w-5 h-5 text-primary" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3,12 L6,12 L8,6 L10,18 L12,3 L14,21 L16,12 L18,12 L21,12" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="font-bold text-primary-foreground">HeartRisk EDA</span>
      </div>
      <p className="text-primary-foreground/70 text-sm mb-2">
        Trabalho acadêmico — Disciplina de INTELIGÊNCIA ARTIFICIAL E DATA SCIENCE
      </p>
      <p className="text-primary-foreground/70 text-sm mb-4">
        Alunos: Theofilo Henrique, Rony Vieira, Jamilly Eloi e Samuel Ruan
      </p>
      <p className="text-primary-foreground/50 text-xs">
        Dataset: Heart Attack Risk Prediction — Kaggle (Sourav Banerjee)
      </p>
    </div>
  </footer>
);

export default Footer;
