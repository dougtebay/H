Regimen = React.createClass({
  render: function() {
    return (
      <div className='regimen'>
        {this.props.data.map(function(drug, i) {
          return (
            <div key={i}>
              {`${drug.name} ` +
              `(${drug.dose_size}) ` +
              `${drug.doses}`}
              {drug.interactions.length > 0 ?
              <Interactions interactions={drug.interactions} /> : null}
            </div>
          )
        })}
      </div>
    )
  }
})

Interactions = React.createClass({
  render: function() {
    return (
      <div className='warning-icon-container'>
        <img className='warning-icon' src='/assets/warning.png' />
        <div className='warning-message'>
          {this.props.interactions.map(function(interaction, i) {
            return (
              <div key={i}>
                <div className='warning-headline'>
                  {`Interacts with ${interaction.drug_name}`}
                </div>
                <p>
                  {interaction.interaction}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    )
  }
})