import React from 'react'
import './loader.sass'
import styled from 'styled-components';

export default function Loader() {
	return (
		<>
			<div class="top">
				<div class="square">
					<div class="square">
						<div class="square">
							<div class="square">
								<div class="square"><div class="square">

								</div></div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="bottom">
				<div class="square">
					<div class="square">
						<div class="square">
							<div class="square">
								<div class="square"><div class="square">
								</div></div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="left">
				<div class="square">
					<div class="square">
						<div class="square">
							<div class="square">
								<div class="square"><div class="square">
								</div></div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="right">
				<div class="square">
					<div class="square">
						<div class="square">
							<div class="square">
								<div class="square"><div class="square">
								</div></div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

