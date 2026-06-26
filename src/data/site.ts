/* ============================================================
   MÓDULO ENGENHARIA — single source of editable content.
   Everything a non-developer edits lives here. Items marked
   ⚠️ PLACEHOLDER must be confirmed with the client before
   go-live. Keep copy faithful to the client's own voice and
   the honesty constraint: the excavator is a symbol of the
   heavy-industry category, never "Módulo's machine".
   ============================================================ */

export type Case = { title: string; summary: string; placeholder: true };

export type Segment = {
  slug: string;
  title: string;
  badge: string;
  img: string;
  intro: string;
  description: string;
  capabilities: string[];
  cases: Case[];
};

export type Metric = {
  value: string;
  prefix: string;
  suffix: string;
  label: string;
  illustrative: boolean;
};

export type NavItem = { label: string; href: string };
export type Service = { code: string; title: string; desc: string };

export type MediaCredit = {
  id: string;
  source: string;
  url: string;
  license: string;
  author?: string;
};

const placeholderCase: Case = {
  title: 'Case a confirmar',
  summary: '⚠️ Placeholder — case real a ser fornecido pelo cliente.',
  placeholder: true,
};

export const site = {
  brand: {
    name: 'Módulo Engenharia',
    tagline: 'Automação e engenharia para a indústria pesada.',
    mission:
      'A Módulo Engenharia procura o aumento da eficiência, maximizando a produtividade e a ' +
      'qualidade através de softwares e hardwares que melhoram a segurança, produtividade, ' +
      'qualidade e informação, além de reduzir o esforço ou a interferência humana sobre o ' +
      'processo ou máquina.',
  },

  contact: {
    // ⚠️ PLACEHOLDER — "+55 31 999485 8169" é ambíguo (um dígito a mais).
    // NÃO publicar sem confirmação do cliente.
    whatsappDigits: '5531999485816',
    whatsappDisplay: '+55 (31) 99948-5816', // ⚠️ derivado do placeholder; confirmar com o cliente
    whatsappConfirmed: false,
    email: 'rodolfocintra.modulo@gmail.com',
    baseLocation: 'Minas Gerais — Brasil',
  },

  nav: [
    { label: 'Sobre', href: '/sobre' },
    { label: 'Serviços', href: '/servicos' },
    { label: 'Mineração', href: '/mineracao' },
    { label: 'Siderurgia', href: '/siderurgia' },
    { label: 'Offshore', href: '/offshore' },
    { label: 'Energia', href: '/energia' },
  ] as NavItem[],

  services: [
    { code: 'S—01', title: 'Automação & Controle de Processos', desc: 'Lógica de CLP, supervisórios SCADA, redes industriais e integração de chão de fábrica. Mais visibilidade, menos parada.' },
    { code: 'S—02', title: 'Engenharia Elétrica & Instrumentação', desc: 'Projeto, dimensionamento e montagem de painéis, sensores e malhas de instrumentação calibradas para ambiente severo.' },
    { code: 'S—03', title: 'Máquinas de Pátio', desc: 'Empilhadeiras e recuperadoras: automação, modernização e retrofit de controle para operação contínua e segura.' },
    { code: 'S—04', title: 'Transportadores de Correia', desc: 'Proteções, pesagem, intertravamentos e controle de acionamento para longas distâncias com alta disponibilidade.' },
    { code: 'S—05', title: 'Montagem & Manutenção Eletromecânica', desc: 'Equipes em campo para montagem, paradas programadas e manutenção corretiva com foco em retorno rápido à produção.' },
    { code: 'S—06', title: 'Comissionamento & Start-up', desc: 'Testes, loop-check e partida assistida. Entregamos o sistema validado, documentado e pronto para operar.' },
  ] as Service[],

  segments: {
    mineracao: {
      slug: 'mineracao', title: 'Mineração', badge: 'MINERAÇÃO', img: '/assets/img/empilhadeira.jpg',
      intro: 'Disponibilidade alta em ambiente abrasivo e crítico.',
      description:
        'Automação e manutenção de máquinas de pátio, transportadores e plantas de beneficiamento — ' +
        'alta disponibilidade em ambiente abrasivo e crítico.',
      capabilities: ['Recuperadoras e empilhadeiras', 'Transportadores de longa distância', 'Supervisório de pátio e beneficiamento'],
      cases: [placeholderCase],
    },
    siderurgia: {
      slug: 'siderurgia', title: 'Siderurgia', badge: 'SIDERURGIA', img: '/assets/img/laminacao.jpg',
      intro: 'Estabilidade e segurança em processos de alta temperatura.',
      description:
        'Instrumentação e controle para processos de alta temperatura — do alto-forno à laminação, ' +
        'com foco em estabilidade e segurança operacional.',
      capabilities: ['Instrumentação de alto-forno', 'Controle de acionamento de laminação', 'Elétrica e automação de planta'],
      cases: [placeholderCase],
    },
    offshore: {
      slug: 'offshore', title: 'Offshore', badge: 'OFFSHORE', img: '/assets/img/offshore-2.jpg',
      intro: 'Controle e segurança no ambiente mais exigente: o mar aberto.',
      description:
        'Sistemas de controle e segurança para plataformas e navios-sonda, projetados para o ambiente ' +
        'mais exigente: o mar aberto.',
      capabilities: ['Sistemas de controle e supervisão', 'Intertravamentos de segurança', 'Manutenção em ambiente crítico'],
      cases: [placeholderCase],
    },
    energia: {
      slug: 'energia', title: 'Energia', badge: 'ENERGIA', img: '/assets/img/paineis.jpg',
      intro: 'Energia confiável e medida para toda a operação industrial.',
      description:
        'Engenharia elétrica e painéis de potência e automação que garantem energia confiável e medida ' +
        'para toda a operação industrial.',
      capabilities: ['Painéis de potência e comando', 'Automação de subestações e CCM', 'Eficiência e qualidade de energia'],
      cases: [placeholderCase],
    },
  } satisfies Record<string, Segment>,

  metrics: [
    { value: '4', prefix: '', suffix: '', label: 'Segmentos atendidos', illustrative: false },
    { value: '15', prefix: '+', suffix: '', label: 'Anos de campo', illustrative: true },
    { value: '120', prefix: '+', suffix: '', label: 'Projetos entregues', illustrative: true },
    { value: '99', prefix: '', suffix: '%', label: 'Disponibilidade média', illustrative: true },
  ] as Metric[],

  legal: {
    cnpj: '00.000.000/0000-00', // ⚠️ PLACEHOLDER
    crea: '', // ⚠️ PLACEHOLDER (se aplicável)
    address: '', // ⚠️ PLACEHOLDER
  },

  forms: {
    // ⚠️ PLACEHOLDER — criar uma chave gratuita em https://web3forms.com e colar aqui.
    web3formsKey: 'WEB3FORMS_ACCESS_KEY_PLACEHOLDER',
  },

  // Procedência das mídias. Licenças sem share-alike (CC BY / Unsplash / Pexels / CC0).
  // O hero é um SÍMBOLO da categoria (não é máquina da Módulo) — escavadeira de
  // rodas de caçambas (classe Bagger), foto real, sem geração por IA.
  media: [
    {
      id: 'hero',
      source: 'Wikimedia Commons',
      url: 'https://commons.wikimedia.org/wiki/File:Schaufelradbagger_im_Tagebau_Hambach_bei_Nacht.jpg',
      license: 'CC BY 4.0',
      author: 'Jan Anskeit',
    },
  ] as MediaCredit[],
};

export type Site = typeof site;
export const whatsappDigits = site.contact.whatsappDigits;
