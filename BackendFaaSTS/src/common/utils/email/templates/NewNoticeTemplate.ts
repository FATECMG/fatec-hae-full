import { type NoticeEmailProps } from '@functions/notice/entities/NoticeEmail'

export const noticeEmailMessageTemplateHTML = (content: NoticeEmailProps): string => {
  let message: string
  const topicsHTML = `${content.topicOfInterest.map((topic) => `<strong>${topic}</strong>`).join(',')}`

  message = `<!DOCTYPE html>
  <html lang="pt-br">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email</title>
  </head>
  <body>
    <span style="opacity: 0"></span>
      <p>
      <strong>FACULDADE DE TECNOLOGIA DE MOGI DAS CRUZES</strong> tem o prazer de anunciar a abertura de um novo edital para 
      submissão de atividades destinadas aos alunos da nossa instituição! Convidamos todos os professores a compartilhar suas ideias e propostas 
      de atividades enriquecedoras. <b>Veja os detalhes abaixo:</b>
      </p>

      <div>
        <h1>${content.title}</h1>
        <h2>Descrição</h2>
        <p>${content.description}</p>
      </div>

      <div>
        <h2>Detalhes do Edital</h2>
          <p> O Edital estará aberto entre os dias <strong>${content.openDate}</strong> e <strong>${content.closeDate}</strong>.</p>
          <p>Os temas de interesse são: ${topicsHTML} .</p>
      </div>

      <p>
      Neste edital, estamos em busca de atividades inovadoras e envolventes, que promovam o aprendizado significativo 
      e o desenvolvimento dos nossos estudantes. Agradecemos a todos os professores que se interessarem em participar!
      </p>

      <p>
        <strong>Atenciosamente,</strong>
      </p>  
    <span style="opacity: 0"></span>    
  </body>
  </html>`.toLocaleUpperCase()

  return message
}
