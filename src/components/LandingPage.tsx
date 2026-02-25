import { useEffect } from 'react';
import { 
  ArrowRight, 
  MapPin, 
  Search, 
  BarChart3, 
  Award, 
  Home, 
  TrendingUp, 
  RefreshCw, 
  Building2, 
  Ruler, 
  Scale, 
  Leaf, 
  Zap, 
  FileText 
} from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
}

export default function LandingPage({ onStart }: LandingPageProps) {
  
  // Smooth scroll for anchor links
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'A' && target.getAttribute('href')?.startsWith('#')) {
        e.preventDefault();
        const id = target.getAttribute('href')?.substring(1);
        const element = document.getElementById(id || '');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);
    return () => document.removeEventListener('click', handleAnchorClick);
  }, []);

  return (
    <div className="bg-[var(--bg)] text-[var(--text)] font-sans min-h-screen overflow-x-hidden">
      
      {/* NAV */}
      <nav className="custom-nav">
        <div className="logo">urb<span>.</span>score</div>
        <div className="nav-links">
          <a href="#problema" className="nav-link">O Problema</a>
          <a href="#como-funciona" className="nav-link">Como Funciona</a>
          <a href="#ciencia" className="nav-link">A Ciência</a>
          <a href="#beneficios" className="nav-link">Benefícios</a>
        </div>
        <button onClick={onStart} className="btn btn-primary">Agendar Demo</button>
      </nav>

      {/* HERO */}
      <section className="hero" id="inicio">
        <div className="hero-left">
          <div className="badge"><span className="live-dot"></span>Análise de Responsividade Urbana</div>
          <h1>O terreno certo<br />não é o mais barato.<br />É o <em>mais conectado.</em></h1>
          <p className="hero-sub">
            O Urb.Score mapeia, pontua e ranqueia terrenos com base na densidade de serviços urbanos em um raio de 800 m a 2,5 km — transformando dados geoespaciais em decisão de compra fundamentada.
          </p>
          <div className="hero-ctas">
            <button onClick={onStart} className="btn btn-primary">Solicitar Acesso Antecipado</button>
            <a href="#como-funciona" className="btn btn-outline">Ver como funciona</a>
          </div>
        </div>
        <div className="hero-right radar-wrap">
          <div className="radar-card">
            <div className="radar-card-header">
              <div>
                <div className="radar-card-title">Score de Responsividade</div>
                <div style={{ fontSize: '12px', color: 'var(--muted-text)', marginTop: '4px' }}>Av. Brigadeiro Faria Lima, 3900</div>
              </div>
              <div className="score-badge">4.3 / 5.0</div>
            </div>

            {/* SVG RADAR CHART */}
            <svg className="radar" width="320" height="280" viewBox="0 0 320 280">
              <defs>
                <radialGradient id="radarFill" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#b8f059" stopOpacity="0.35"/>
                  <stop offset="100%" stopColor="#b8f059" stopOpacity="0.05"/>
                </radialGradient>
              </defs>
              {/* Grid rings */}
              <g stroke="rgba(255,255,255,0.06)" fill="none">
                <polygon points="160,50 251,108 251,193 160,251 69,193 69,108" strokeWidth="1"/>
                <polygon points="160,79 228,122 228,172 160,215 92,172 92,122" strokeWidth="1"/>
                <polygon points="160,109 206,137 206,151 160,179 114,151 114,137" strokeWidth="1"/>
                <polygon points="160,139 183,152 183,131 160,143 137,131 137,152" strokeWidth="1"/>
              </g>
              {/* Axis lines */}
              <g stroke="rgba(255,255,255,0.06)" strokeWidth="1">
                <line x1="160" y1="50" x2="160" y2="251"/>
                <line x1="160" y1="50" x2="251" y2="193"/>
                <line x1="160" y1="50" x2="69" y2="193"/>
                <line x1="251" y1="108" x2="69" y2="193"/>
                <line x1="251" y1="108" x2="69" y2="108"/>
              </g>

              {/* Data polygon */}
              <polygon
                points="160,60 238,113 243,187 160,211 85,119"
                fill="url(#radarFill)"
                stroke="#b8f059"
                strokeWidth="2"
                strokeLinejoin="round"
                opacity="0.9"
              />

              {/* Dots on each vertex */}
              <circle cx="160" cy="60" r="4" fill="#b8f059"/>
              <circle cx="238" cy="113" r="4" fill="#b8f059"/>
              <circle cx="243" cy="187" r="4" fill="#b8f059"/>
              <circle cx="160" cy="211" r="4" fill="#b8f059"/>
              <circle cx="85" cy="119" r="4" fill="#5af0c4"/>

              {/* Labels */}
              <text x="160" y="38" textAnchor="middle" fill="#9ab8cc" fontSize="11" fontFamily="Space Mono, monospace">Saúde 4.5</text>
              <text x="267" y="110" textAnchor="start" fill="#9ab8cc" fontSize="11" fontFamily="Space Mono, monospace">Educação 4.2</text>
              <text x="267" y="195" textAnchor="start" fill="#9ab8cc" fontSize="11" fontFamily="Space Mono, monospace">Transporte 4.8</text>
              <text x="160" y="270" textAnchor="middle" fill="#9ab8cc" fontSize="11" fontFamily="Space Mono, monospace">Lazer 3.8</text>
              <text x="53" y="110" textAnchor="end" fill="#5af0c4" fontSize="11" fontFamily="Space Mono, monospace">Comércio 4.0</text>
            </svg>

            <div className="radar-address">
              <span style={{ color: 'var(--accent-color)' }}>●</span> Geolocalização ativa — Google Places API
            </div>
          </div>

          <div className="stats-row">
            <div className="stat">
              <div className="stat-val">47</div>
              <div className="stat-label">Serviços mapeados</div>
            </div>
            <div className="stat">
              <div className="stat-val">800m</div>
              <div className="stat-label">Raio mínimo</div>
            </div>
            <div className="stat">
              <div className="stat-val">2.5km</div>
              <div className="stat-label">Raio máximo</div>
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEMA */}
      <section className="problema landing-section" id="problema">
        <div className="section-label">O problema que resolvemos</div>
        <h2>Cidades que crescem<br />pelas bordas têm um<br /><em>custo invisível.</em></h2>
        <p className="lead" style={{ marginTop: '16px' }}>Incorporadoras e corretores avaliam terrenos por preço por m² e potencial construtivo — mas ignoram a variável que mais impacta a vida de quem vai morar lá: o acesso a uma cidade funcional.</p>

        <div className="problema-grid">
          <div className="problema-items">
            <div className="prob-item">
              <div className="prob-icon"><Home size={24} /></div>
              <div>
                <div className="prob-title">Espraiamento urbano sem critério</div>
                <div className="prob-desc">Novos empreendimentos surgem em periferias desconectadas, pressionando a infraestrutura existente e impondo horas de deslocamento diário aos moradores — custo real que não aparece no preço do apartamento.</div>
              </div>
            </div>
            <div className="prob-item">
              <div className="prob-icon"><TrendingUp size={24} /></div>
              <div>
                <div className="prob-title">Análise de viabilidade incompleta</div>
                <div className="prob-desc">Os estudos de viabilidade tradicionais medem potencial construtivo, coeficiente de aproveitamento e preço do terreno — mas não medem o que está em volta. O contexto urbano fica de fora da planilha.</div>
              </div>
            </div>
            <div className="prob-item">
              <div className="prob-icon"><RefreshCw size={24} /></div>
              <div>
                <div className="prob-title">Decisão por intuição, não por dado</div>
                <div className="prob-desc">A percepção de "boa localização" é subjetiva e enviesada. Sem dados padronizados e metodologia clara, incorporadoras competentes tomam decisões iguais às desinformadas — e perdem vantagem competitiva.</div>
              </div>
            </div>
          </div>
          <div className="quote-block">
            <div className="quote-text">
              "O planejamento urbano falha não porque os planejadores querem cidades ruins, mas porque não escutam os sinais que os mercados e as pessoas já estão enviando."
            </div>
            <div className="quote-author">
              — <strong>Alain Bertaud</strong><br />
              Economista Urbano Sênior do Banco Mundial<br />
              <em>Order Without Design: How Markets Shape Cities (2018)</em>
            </div>
            <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid var(--border-color)' }}>
              <p style={{ fontSize: '13px', color: 'var(--muted-text)', lineHeight: 1.65 }}>A teoria da <strong style={{ color: 'var(--text)' }}>responsividade urbana</strong> propõe que boas cidades não resultam de masterplans rígidos, mas da capacidade do tecido urbano de <em>responder</em> às necessidades cotidianas de seus moradores — com proximidade real a serviços essenciais.</p>
            </div>
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section className="landing-section" id="como-funciona">
        <div className="section-label">Metodologia</div>
        <h2>Da coordenada GPS<br />ao <em>score de decisão</em><br />em segundos.</h2>
        <div className="steps">
          <div className="step">
            <div className="step-num">01 —</div>
            <div className="step-icon"><MapPin size={24} /></div>
            <div className="step-title">Insira o endereço</div>
            <div className="step-desc">Digite ou selecione o endereço do terreno em avaliação. A plataforma captura as coordenadas via Google Maps e centraliza a análise na localização exata.</div>
          </div>
          <div className="step">
            <div className="step-num">02 —</div>
            <div className="step-icon"><Search size={24} /></div>
            <div className="step-title">Mapeamento automático</div>
            <div className="step-desc">Via Google Places API, o sistema varre um raio de 800m a 2,5 km e cataloga serviços de saúde, educação, transporte, lazer e comércio existentes na região.</div>
          </div>
          <div className="step">
            <div className="step-num">03 —</div>
            <div className="step-icon"><BarChart3 size={24} /></div>
            <div className="step-title">Pontuação por categoria</div>
            <div className="step-desc">Cada categoria recebe uma nota de 0 a 5, proporcional à densidade de serviços mapeados. Os dados são exibidos em um gráfico de radar para leitura imediata.</div>
          </div>
          <div className="step">
            <div className="step-num">04 —</div>
            <div className="step-icon"><Award size={24} /></div>
            <div className="step-title">Nota final de responsividade</div>
            <div className="step-desc">A média ponderada das categorias gera o Urb.Score — um indicador único, comparável entre diferentes terrenos, que entra direto no seu relatório de viabilidade.</div>
          </div>
        </div>
      </section>

      {/* CIÊNCIA */}
      <section className="ciencia landing-section" id="ciencia">
        <div className="section-label">Embasamento teórico</div>
        <h2>Urbanismo baseado<br />em <em>evidência,</em><br />não em intuição.</h2>

        <div className="ciencia-grid">
          <div>
            <p className="lead" style={{ marginBottom: '32px' }}>O Urb.Score é construído sobre os princípios da responsividade urbana — a capacidade de um local de atender às demandas cotidianas de seus moradores com proximidade e eficiência.</p>
            <div className="conceito-cards">
              <div className="conceito-card">
                <div className="conceito-num">01</div>
                <div>
                  <div className="conceito-title">Caminhabilidade Efetiva</div>
                  <div className="conceito-desc">800m é o padrão internacional de distância caminhável — o equivalente a 10 minutos a pé. Dentro desse raio, serviços têm impacto direto na qualidade de vida e na valorização do imóvel.</div>
                </div>
              </div>
              <div className="conceito-card">
                <div className="conceito-num">02</div>
                <div>
                  <div className="conceito-title">Densidade de Serviços como Valor</div>
                  <div className="conceito-desc">Segundo Bertaud, a proximitade funcional reduz o custo de transporte das famílias, libera renda para consumo local e gera ciclos de desenvolvimento econômico positivos no bairro.</div>
                </div>
              </div>
              <div className="conceito-card">
                <div className="conceito-num">03</div>
                <div>
                  <div className="conceito-title">Sustentabilidade Real</div>
                  <div className="conceito-desc">Cidades compactas e conectadas emitem menos carbono, sobrecarregam menos o sistema viário e de transporte público, e criam comunidades mais resilientes e com menor dependência do automóvel.</div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div style={{ background: 'var(--bg)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '36px', marginBottom: '24px' }}>
              <div className="section-label" style={{ marginBottom: '20px' }}>Categorias analisadas</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {/* Category bars */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}>🏥 Saúde</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--accent-color)' }}>UBSs, Hospitais, Clínicas, Farmácias</span>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '2px', height: '4px' }}>
                    <div style={{ width: '90%', background: 'var(--accent-color)', height: '100%', borderRadius: '2px' }}></div>
                  </div>
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}>🎓 Educação</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--accent-color)' }}>Escolas, Faculdades, Creches</span>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '2px', height: '4px' }}>
                    <div style={{ width: '84%', background: 'var(--accent-color)', height: '100%', borderRadius: '2px' }}></div>
                  </div>
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}>🚌 Transporte</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--accent-color)' }}>Metrô, Ônibus, BRT, Ciclovias</span>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '2px', height: '4px' }}>
                    <div style={{ width: '96%', background: 'var(--accent-color)', height: '100%', borderRadius: '2px' }}></div>
                  </div>
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}>🌳 Lazer</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--accent-color)' }}>Parques, Praças, Academias, Cultura</span>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '2px', height: '4px' }}>
                    <div style={{ width: '76%', background: 'var(--accent-color)', height: '100%', borderRadius: '2px' }}></div>
                  </div>
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}>🛒 Comércio</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--accent-color)' }}>Mercados, Restaurantes, Bancos</span>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '2px', height: '4px' }}>
                    <div style={{ width: '80%', background: 'var(--accent-color)', height: '100%', borderRadius: '2px' }}></div>
                  </div>
                </div>
              </div>
            </div>
            <div style={{ background: 'rgba(184,240,89,0.05)', border: '1px solid rgba(184,240,89,0.2)', borderRadius: '8px', padding: '20px 24px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--accent-color)', marginBottom: '8px' }}>💡 Por que 800m a 2,5km?</div>
              <div style={{ fontSize: '13px', color: 'var(--muted-text)', lineHeight: 1.6 }}>800m = distância caminhável (10min). De 800m a 2,5km = distância ciclável ou de transporte coletivo (5–20min). Além disso, o impacto na qualidade de vida cai drasticamente — por isso delimitamos o scoring nesse intervalo.</div>
            </div>
          </div>
        </div>
      </section>

      {/* BENEFÍCIOS */}
      <section className="landing-section" id="beneficios">
        <div className="section-label">Proposta de valor</div>
        <h2>Para quem decide<br />onde a cidade <em>vai crescer.</em></h2>
        <div className="beneficios-grid">
          <div className="benef-card">
            <div className="benef-tag">Incorporadoras</div>
            <div className="benef-icon"><Building2 size={24} /></div>
            <div className="benef-title">Argumento de venda com respaldo técnico</div>
            <div className="benef-desc">Transforme "boa localização" em um número verificável. Apresente o Urb.Score no material de vendas e justifique o VGV com dados concretos sobre o entorno — diferenciando seu produto da concorrência.</div>
          </div>
          <div className="benef-card">
            <div className="benef-tag">Corretores de Terreno</div>
            <div className="benef-icon"><Ruler size={24} /></div>
            <div className="benef-title">Due diligence de localização padronizada</div>
            <div className="benef-desc">Adicione uma camada de análise urbana ao seu processo de prospecção. Identifique terrenos subvalorizados com alto potencial de responsividade antes que a concorrência perceba.</div>
          </div>
          <div className="benef-card">
            <div className="benef-tag">Tomadores de decisão</div>
            <div className="benef-icon"><Scale size={24} /></div>
            <div className="benef-title">Comparação objetiva entre terrenos</div>
            <div className="benef-desc">Coloque dois ou mais terrenos lado a lado. O Urb.Score transforma uma decisão qualitativa em análise comparativa — permitindo escolhas mais rápidas, rastreáveis e defensáveis em comitê.</div>
          </div>
          <div className="benef-card">
            <div className="benef-tag">ESG e Impacto</div>
            <div className="benef-icon"><Leaf size={24} /></div>
            <div className="benef-title">Métrica real de impacto urbano</div>
            <div className="benef-desc">Relatórios ESG precisam de dados. O Urb.Score fornece uma métrica auditável de contribuição à cidade compacta e sustentável — elevando a qualidade dos relatórios de impacto social da sua empresa.</div>
          </div>
          <div className="benef-card">
            <div className="benef-tag">Velocidade</div>
            <div className="benef-icon"><Zap size={24} /></div>
            <div className="benef-title">Análise em menos de 2 minutos</div>
            <div className="benef-desc">O que levaria dias de pesquisa manual é entregue automaticamente. Processe dezenas de terrenos por semana sem aumentar a equipe — mais velocidade na triagem, melhor tomada de decisão.</div>
          </div>
          <div className="benef-card">
            <div className="benef-tag">Relatório</div>
            <div className="benef-icon"><FileText size={24} /></div>
            <div className="benef-title">Output pronto para apresentação</div>
            <div className="benef-desc">O relatório gerado inclui gráfico de radar, score por categoria, nota final e mapeamento dos serviços encontrados — pronto para entrar no estudo de viabilidade ou pitch para investidores.</div>
          </div>
        </div>
      </section>

      {/* IMPACTO */}
      <section className="impacto landing-section" id="impacto">
        <div className="impacto-inner">
          <div className="section-label">Impacto urbano</div>
          <h2>Não é só análise.<br />É uma <em>posição sobre</em><br />como cidades devem crescer.</h2>
          <p className="lead">Cada empreendimento em local responsivo economiza horas na vida de centenas de moradores, alivia o trânsito da cidade e reduz emissões. O Urb.Score é a ponte entre decisão privada e impacto público.</p>

          <div className="metrics">
            <div className="metric">
              <div className="metric-val">2h</div>
              <div className="metric-label">tempo médio diário perdido no trânsito por brasileiros que moram longe de serviços</div>
            </div>
            <div className="metric">
              <div className="metric-val">35%</div>
              <div className="metric-label">das emissões de carbono urbanas vêm de deslocamentos evitáveis</div>
            </div>
            <div className="metric">
              <div className="metric-val">800m</div>
              <div className="metric-label">é tudo que separa uma vida com ou sem dependência do automóvel</div>
            </div>
          </div>

          <blockquote style={{ fontFamily: 'var(--font-mono)', fontSize: '17px', color: 'var(--muted-text)', fontStyle: 'italic', borderLeft: '3px solid var(--accent-color)', paddingLeft: '24px', textAlign: 'left', maxWidth: '600px', margin: '0 auto' }}>
            "Uma cidade que funciona não é um resultado de design — é resultado de mercados e pessoas que conseguem ler e responder aos sinais urbanos corretamente."
            <div style={{ marginTop: '12px', fontSize: '12px', color: 'var(--muted-text)' }}><strong style={{ color: 'var(--accent-color)' }}>Alain Bertaud</strong> — Order Without Design</div>
          </blockquote>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section" id="cta">
        <div className="badge" style={{ marginBottom: '32px' }}>Acesso Antecipado Disponível</div>
        <h2 style={{ maxWidth: '640px', margin: '0 auto 20px' }}>Pronto para tomar decisões<br />de localização com <em>dados reais?</em></h2>
        <p className="lead" style={{ maxWidth: '500px', margin: '0 auto 48px' }}>Junte-se às primeiras incorporadoras e corretores que estão adicionando a análise de responsividade urbana ao seu processo de seleção de terrenos.</p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={onStart} className="btn btn-primary" style={{ padding: '16px 40px', fontSize: '15px' }}>Agendar uma Demo Gratuita</button>
          <button onClick={onStart} className="btn btn-outline" style={{ padding: '16px 40px', fontSize: '15px' }}>Analisar um Terreno Agora</button>
        </div>
        <p className="cta-note">Sem compromisso. Primeiro relatório gratuito.</p>
      </section>

      {/* FOOTER */}
      <footer className="custom-footer">
        <div className="logo">urb<span>.</span>score</div>
        <p>Análise de Responsividade Urbana para o Mercado Imobiliário</p>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--muted-text)' }}>© 2025 Urb.Score</p>
      </footer>

    </div>
  );
}
