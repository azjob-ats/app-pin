import { LearnMoreConfigResponse } from '@shared/interfaces/dto/response/learn-more';

/** Used when the backend endpoint is not yet available (returns 404). */
export const LEARN_MORE_CONFIG_MOCK: LearnMoreConfigResponse = {
  stepperLearnMore: [
    {
      id: 'job-content',
      title: 'Descrição da vaga',
      layout: 'horizontal',
      elements: [
        {
          id: 'applyJob',
          type: 'textHTML',
                    value: `<div class="text-center text-4xl font-medium">Engenheiro de Software Especialista | Python</div> <div><p dir="ltr"><strong>💙 Sobre a Digix</strong></p> <p dir="ltr">Na Digix, somos o ecossistema que transforma o varejo brasileiro. Nossa missão é ser a parceira nº 1 do empreendedor, impulsionando seu negócio e sua vida com soluções que integram gestão, vendas, finanças e logística.</p> <p dir="ltr">Com tecnologia, inovação e um time colaborativo, ajudamos mais de 50 mil lojistas a crescerem de forma competitiva e sustentável. Aqui, construímos juntos o futuro do comércio — com conexão, impacto e propósito.</p> <p><strong>&nbsp;</strong></p> <p dir="ltr"><strong>🚀 Como você vai fortalecer a nossa missão:</strong></p> <p dir="ltr">Seu papel como<strong> Engenheiro de Software Especialista focado em python </strong>na Digix será implementar soluções na jornada do cliente com qualidade para que nossos clientes possam competir e crescer no mercado. Para fazer parte, buscamos profissionais que adoram desafios, tecnologia e estejam dispostos a trabalhar em equipe para conquistar os resultados<br><br aria-hidden="true">Esta é uma vaga<strong> remota</strong>, em regime CLT e a logística de trabalho é perfeita para quem mora em qualquer lugar do Brasil.</p> <p><strong>&nbsp;</strong></p> <p dir="ltr"><strong>💪 Suas principais responsabilidades:</strong></p> <ul> <li>Desenvolver e melhorar funcionalidades, de acordo com as sprint do projeto;</li> <li>Desenvolver em equipe soluções compatíveis com a necessidade da empresa e do sistema;</li> <li>Evoluir constantemente, desenvolvendo aplicações escaláveis e utilizando boas práticas de desenvolvimento de software;</li> <li>Melhorar a qualidade das integrações e garantir a interoperabilidade;</li> <li>Apontar melhorias contínuas nas soluções já existentes.<br><br></li> </ul> <p dir="ltr"><strong>🔎 O que buscamos:</strong></p> <ul> <li dir="ltr">Experiência em HTML, CSS e JavaScript;</li> <li dir="ltr">Experiência em PostgreSQL;</li> <li dir="ltr">Experiência em boas práticas de desenvolvimento (SOLID e Clean code);</li> <li dir="ltr">Experiência em criação e manutenção APIs REST;</li> <li dir="ltr">Experiência em criação e manutenção de micro-serviços e computação distribuída;</li> <li dir="ltr">Experiência em controle de versões e releases utilizando Git;</li> <li dir="ltr">Experiência na construção de aplicações escaláveis, padrões de design, frameworks de desenvolvimento, AWS e Linux;</li> <li dir="ltr">Experiência em gerenciamento de filas e tópicos como SNS/SQS;</li> <li dir="ltr">Experiência com armazenamento em nuvem como S3 e utilização de CDNs;</li> <li dir="ltr">Experiência com construção de testes unitários e funcionais.</li> <li dir="ltr">Conhecimento e experiência em Python;</li> </ul> <p><strong>&nbsp;</strong></p> <p dir="ltr"><strong>✨ Vai brilhar ainda mais se tiver:</strong></p> <p dir="ltr">Esses requisitos não são obrigatórios, mas podem destacar ainda mais seu perfil:</p> <ul> <li dir="ltr">Conhecimento em PHP, Laravel e PHPUnit;</li> <li>Conhecimento em Angular 17, NodeJS, Jest;</li> <li dir="ltr">Conhecimento em Go;</li> <li dir="ltr">Conhecimento em Backend for Frontend (BFF), NestJS e Typescript;</li> <li dir="ltr">Conhecimento em Microfrontend com module federation;</li> <li dir="ltr">Conhecimento com CI/CD e construção de pipelines;</li> <li dir="ltr">Conhecimento de métricas e observabilidade de software em plataformas como Prometheus e Grafana.</li> </ul> <p><strong>&nbsp;</strong></p> <p dir="ltr"><strong>📋 Como funciona o nosso processo seletivo?</strong></p> <p dir="ltr">Acreditamos que grandes parcerias começam com boas conversas. Nosso processo é construído em etapas para que você conheça mais sobre a Digix e a gente conheça mais sobre você:</p> <p dir="ltr">• Inscrição</p> <p dir="ltr">• Entrevista com o time de Gente &amp; Gestão</p> <p dir="ltr">• Entrevista com liderança da área,</p> <p dir="ltr">• Entrevista técnica final com liderança e pares do time.</p> <p dir="ltr">Todas as etapas são realizadas de forma remota. Caso haja necessidade de uma conversa presencial, avisaremos com antecedência.</p> <p><strong>&nbsp;</strong></p> <p dir="ltr"><strong>🤩 Benefícios flexíveis, do seu jeito:</strong></p> <p dir="ltr">Na Digix, acreditamos que cada pessoa tem uma jornada única, e nossos benefícios refletem isso. Porque cuidar dos Digixers também é parte da nossa missão. 💙</p> <p dir="ltr">⭐<strong> Cartão Caju: </strong>liberdade para usar seu saldo em categorias como alimentação, mobilidade, home office, cultura, saúde e educação</p> <p dir="ltr">⭐ P<strong>lano de Saúde e Plano Odontológico:</strong> diferentes opções para que você escolha o cuidado que melhor combina com sua realidade</p> <p dir="ltr">⭐<strong> Wellhub e TotalPass:</strong> acesso a academias, estúdios e plataformas de bem-estar para cuidar do corpo e da mente do seu jeito</p> <p dir="ltr">⭐ <strong>Auxílio-creche:</strong> apoio no cuidado com a família desde os primeiros passos</p> <p dir="ltr">⭐ <strong>Plano de Saúde Pet: </strong>aqui o cuidado se estende até aos nossos pets</p> <p dir="ltr"><strong>⭐ Parceria com o SESC: </strong>benefícios exclusivos em lazer, cultura e qualidade de vida</p> <p dir="ltr">⭐ <strong>Terapia online:</strong> apoio emocional com acesso facilitado, no seu tempo e espaço</p></div>`,

        },
      ],
    },
    {
      id: 'personal-info',
      title: 'Informações de contato',
      layout: 'horizontal',
      elements: [
        {
          classes: ['col-12 md:col-6'],
          type: 'text',
          id: 'firstName',
          label: 'Nome completo',
          placeholder: 'Informe seu nome',
          validators: { required: false },
        },
        {
          classes: ['col-12 md:col-6'],
          type: 'text',
          id: 'phone',
          label: 'Celular com DDD',
          placeholder: '(11) 99999-9999',
          validators: { required: false },
        },
        {
          classes: ['col-12 md:col-6'],
          type: 'text',
          id: 'linkedin',
          label: 'LinkedIn',
          placeholder: 'linkedin.com/in/seu-perfil',
        },
        {
          classes: ['col-12 md:col-6'],
          type: 'email',
          id: 'email',
          label: 'Seu melhor e-mail',
          placeholder: 'email@exemplo.com',
          validators: { required: false },
        },
        {
          classes: ['col-12 md:col-6'],
          type: 'select',
          id: 'country',
          label: 'País de origem',
          placeholder: 'Selecione',
          options: [
            { name: 'Brasil', code: 'br' },
            { name: 'EUA', code: 'us' },
            { name: 'Portugal', code: 'pt' },
          ],
          validators: { required: true, erroRequired: 'Este campo é obrigatório.' },
        },
        {
          classes: ['col-12 md:col-6'],
          type: 'text',
          id: 'city',
          label: 'Cidade',
          placeholder: 'Informe sua cidade',
        },
        {
          classes: ['col-12'],
          type: 'uploadFile',
          id: 'attachedResume',
          label: 'Currículo (PDF)',
          validators: { accept: '.pdf', multiple: false, allowedTypes: ['application/pdf'], maxFileSizeMB: 15 },
        },
        {
          classes: ['col-12'],
          type: 'checkboxAuthorize',
          id: 'authorizeDataStorage',
          label: 'Concordo que meus dados pessoais sejam armazenados e processados pela azjob, exclusivamente para fins de recrutamento e seleção.',
          placeholder: '',
          validators: { required: true },
        },
        {
          classes: ['col-12'],
          type: 'checkboxAuthorize',
          id: 'authorizeDataSharing',
          label: 'Autorizo a RealWe a enviar informações sobre novas oportunidades de emprego.',
          placeholder: '',
          validators: { required: true },
        },
      ],
    },
  ],
  stepperConfig: {
    showStepProgress: true,
    showCheckboxPrivacyPolicy: true,
    nameLastButton: 'Candidatar-se para a vaga',
    setRevisionStepper: true,
  },
};
